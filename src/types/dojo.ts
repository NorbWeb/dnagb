export interface Dojo {
  id: number;
  status: "published" | "draft";
  name: string;
  logo: string;
  link: string;
  city: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  description: string;
}

export interface Source {
  type: "FeatureCollection";
  features: Feature[];
}

export interface Feature {
  type: "Feature";
  properties: Record<string, string>;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface DojoInfo {
  name: string;
  city: string;
  link: string;
  description: string;
  logo: string;
}
