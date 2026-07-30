import { NextRequest } from "next/server";
import JSZip from "jszip";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const supabase = createServiceClient();

  // 1. Resolve token → share link. Same auth gate as the page.
  const { data: shareLink, error: shareLinkError } = await supabase
    .from("share_links")
    .select("id")
    .eq("token", token)
    .single();

  if (shareLinkError || !shareLink) {
    return new Response("Not found", { status: 404 });
  }

  // 2. Fetch photos THROUGH the join — only this token's grant set.
  const { data: grantedRows, error: grantedError } = await supabase
    .from("share_link_photos")
    .select("photos(storage_path)")
    .eq("share_link_id", shareLink.id);

  if (grantedError || !grantedRows) {
    return new Response("Not found", { status: 404 });
  }

  const storagePaths = grantedRows
    .flatMap((row) => row.photos)
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => p.storage_path);

  if (storagePaths.length === 0) {
    return new Response("No photos", { status: 404 });
  }

  // 3. Download each granted file from storage and add to the zip.
  const zip = new JSZip();

  await Promise.all(
    storagePaths.map(async (path, index) => {
      const { data, error } = await supabase.storage
        .from("photos")
        .download(path);

      if (error || !data) return; // skip a missing file rather than fail all

      const arrayBuffer = await data.arrayBuffer();
      // Derive a friendly filename; fall back to an index if needed.
      const filename = path.split("/").pop() ?? `photo-${index + 1}.jpg`;
      zip.file(filename, arrayBuffer);
    }),
  );

  // 4. Generate the zip in memory and return it as a download.
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="photos.zip"',
    },
  });
}
