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
  createdAt: Date;
};

// Serialized versions (for API responses — ObjectId → string)
export type Brand = Omit<BrandDoc, "_id" | "createdAt"> & { _id: string; createdAt: string; modelCount?: number; soldThisYear?: number; soldThisMonth?: number; serviceCenters?: number };
export type Model = Omit<ModelDoc, "_id" | "createdAt"> & { _id: string; createdAt: string };
export type Variant = Omit<VariantDoc, "_id" | "createdAt"> & { _id: string; createdAt: string };
