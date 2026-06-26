"use client";

import {
  formatDate,
  formatFileSize,
  groupDocumentsByDate,
} from "@/lib/helpers";

import { Document } from "@/types/db";
import { IconFileText } from "@tabler/icons-react";
import React from "react";

type DocumentListProps = {
  documents: Document[] | null;
};

function DocumentList({ documents }: DocumentListProps) {
  const groups = groupDocumentsByDate(documents ?? []);

  return (
    <div className="bg-white rounded-2xl px-3 py-2">
      {Object.entries(groups).map(([label, groupDocuments]) => {
        const dateLabel = formatDate(new Date(groupDocuments[0].uploaded_at));
        const showDateLabel = label === "Today" || label === "Yesterday";
        return (
          <div key={label} className="flex flex-col gap-4">
            {groupDocuments.map((document) => {
              const documentSize = formatFileSize(document.size_bytes);
              return (
                <div
                  key={document.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-3 items-center text-foreground py-2"
                >
                  <div className="flex w-10 h-10 bg-gray-100 rounded-md items-center justify-center shrink-0">
                    <IconFileText size={24} stroke={1.5} />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h2 className="text-base font-semibold truncate">
                      {document.name}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Uploaded {label} {showDateLabel && ` · ${dateLabel}`}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    <span className="text-sm text-muted-foreground shrink-0">
                      {documentSize}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default DocumentList;
