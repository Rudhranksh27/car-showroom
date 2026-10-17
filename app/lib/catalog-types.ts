export type BrandDoc = {
  _id?: import("mongodb").ObjectId;
  name: string;
  slug: string;
  logo?: string;
  established?: string;
  soldThisYear?: number;
  soldThisMonth?: number;
  serviceCenters?: number;
  createdAt: Date;
};

export type Highlight = { title: string; description?: string };

export type ModelDoc = {
  _id?: import("mongodb").ObjectId;
  brandId: string;
  brandSlug: string;
  brandName: string;
  name: string;
  slug: string;
  type: string;
  fuels: string[];
  priceMin: number;
  priceMax: number;
  specs: string;
  image?: string;
  // Basic information
  segment?: string;
  modelYear?: number;
  transmissions?: string[];
  drive?: string; // drivetrain, e.g. FWD / RWD / AWD / 4WD
  // Description
  overview?: string;
  highlights?: (Highlight | string)[]; // legacy entries are plain strings
  // Dimensions (mm)
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  // Capacity
  seatingCapacity?: number;
  doors?: number;
  bootSpace?: number; // litres
  // Images
  exteriorImages?: string[];
  interiorImages?: string[];
  // Documents
  brochureUrl?: string;
  websiteUrl?: string;
  // Metadata
  launchDate?: string; // YYYY-MM-DD
  discontinued?: boolean;
  published?: boolean; // undefined is treated as published
  createdAt: Date;
};

// A configuration of a variant (e.g. ZXi MT Dual Tone under ZXi). Stored inside its parent VariantDoc.
export type SubVariantDoc = {
  id: string; // URL-safe, unique within the parent variant
  name: string; // e.g. "ZXi MT Dual Tone"
  engine: string; // e.g. "1462 cc", "998 cc Turbo (Boosterjet)"
  fuel: string;
  transmission: string; // e.g. "5-speed Manual"
  paint: string; // "Single Tone" | "Dual Tone"
  colors?: string[]; // every colour this configuration is sold in (the customer picks one)
  color?: string; // legacy single colour // e.g. "Pearl Arctic White"; configurations identical except colour are grouped when booking
  price?: string; // falls back to the parent variant's price when blank
  description?: string;
};

export type VariantDoc = {
  _id?: import("mongodb").ObjectId;
  modelId: string;
  modelSlug: string;
  modelName: string;
  name: string;
  description?: string;
  fuel: string;
  transmission: string;
  specs: string;
  price: string;
  subVariants?: SubVariantDoc[];
  createdAt: Date;
};

// Serialized versions (for API responses — ObjectId → string)
export type Brand = Omit<BrandDoc, "_id" | "createdAt"> & { _id: string; createdAt: string; modelCount?: number; soldThisYear?: number; soldThisMonth?: number; serviceCenters?: number };
export type Model = Omit<ModelDoc, "_id" | "createdAt"> & { _id: string; createdAt: string };
export type Variant = Omit<VariantDoc, "_id" | "createdAt"> & { _id: string; createdAt: string };
