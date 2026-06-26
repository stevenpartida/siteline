"use server";

import type { Coordinates } from "@/types/location";
import type { CreateProjectFormValues } from "@/lib/validators/project";

interface MapboxAddressContext {
  address_number?: string;
  street_name?: string;
  name?: string;
}

interface MapboxContext {
  address?: MapboxAddressContext;
  street?: { name?: string };
  place?: { name?: string };
  region?: { name?: string; region_code?: string };
  postcode?: { name?: string };
}

interface MapboxFeature {
  properties: {
    feature_type: string;
    full_address: string;
    context: MapboxContext;
  };
}

interface MapboxResponse {
  type: "FeatureCollection";
  features: MapboxFeature[];
}

type PrefillFields = Pick<
  CreateProjectFormValues,
  "address_line_1" | "city" | "state" | "zip_code"
>;

type AddressLookupResult =
  | { success: true; address: PrefillFields }
  | { success: false; error: string };

export async function getAddressFromCoordsAction(
  coords: Coordinates,
): Promise<AddressLookupResult> {
  const { lat, lng } = coords;

  const params = new URLSearchParams({
    longitude: lng.toString(),
    latitude: lat.toString(),
    types: "address",
    access_token: process.env.MAPBOX_ACCESS_TOKEN ?? "",
  });

  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?${params}`,
    );

    if (!response.ok) {
      return { success: false, error: `Mapbox returned ${response.status}` };
    }

    const data: MapboxResponse = await response.json();
    const feature = data.features[0];

    if (!feature) {
      return { success: false, error: "No address found for this location" };
    }

    const { address, street, place, region, postcode } =
      feature.properties.context;

    const addressLine1 =
      address?.name ??
      [address?.address_number, address?.street_name ?? street?.name]
        .filter(Boolean)
        .join(" ");

    return {
      success: true,
      address: {
        address_line_1: addressLine1 || "",
        city: place?.name ?? "",
        state: region?.region_code ?? region?.name ?? "",
        zip_code: postcode?.name ?? "",
      },
    };
  } catch {
    return { success: false, error: "Failed to reach geocoding service" };
  }
}
