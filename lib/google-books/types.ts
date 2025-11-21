import { z } from "zod"

// Industry Identifiers (ISBN, ISSN, etc.)
export const industryIdentifierSchema = z.object({
  type: z.enum(["ISBN_10", "ISBN_13", "ISSN", "OTHER"]),
  identifier: z.string(),
})

// Image Links
export const imageLinksSchema = z.object({
  smallThumbnail: z.string().optional(),
  thumbnail: z.string().optional(),
  small: z.string().optional(),
  medium: z.string().optional(),
  large: z.string().optional(),
  extraLarge: z.string().optional(),
})

// Reading Modes
export const readingModesSchema = z.object({
  text: z.boolean().optional(),
  image: z.boolean().optional(),
})

// Dimensions
export const dimensionsSchema = z.object({
  height: z.string().optional(),
  width: z.string().optional(),
  thickness: z.string().optional(),
})

// Volume Info - Core book metadata
export const volumeInfoSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  authors: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  industryIdentifiers: z.array(industryIdentifierSchema).optional(),
  readingModes: readingModesSchema.optional(),
  pageCount: z.number().optional(),
  printType: z.string().optional(),
  categories: z.array(z.string()).optional(),
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
  maturityRating: z.string().optional(),
  allowAnonLogging: z.boolean().optional(),
  contentVersion: z.string().optional(),
  imageLinks: imageLinksSchema.optional(),
  language: z.string().optional(),
  previewLink: z.string().optional(),
  infoLink: z.string().optional(),
  canonicalVolumeLink: z.string().optional(),
  dimensions: dimensionsSchema.optional(),
  printedPageCount: z.number().optional(),
})

// Sale Info - Pricing and purchase information
export const listPriceSchema = z.object({
  amount: z.number().optional(),
  currencyCode: z.string().optional(),
  amountInMicros: z.number().optional(),
})

export const saleInfoSchema = z.object({
  country: z.string().optional(),
  saleability: z.enum(["FOR_SALE", "FREE", "NOT_FOR_SALE", "FOR_PREORDER"]).optional(),
  isEbook: z.boolean().optional(),
  listPrice: listPriceSchema.optional(),
  retailPrice: listPriceSchema.optional(),
  buyLink: z.string().optional(),
  onSaleDate: z.string().optional(),
})

// Access Info - Availability and access restrictions
export const accessInfoSchema = z.object({
  country: z.string().optional(),
  viewability: z.enum(["NO_PAGES", "PARTIAL", "ALL_PAGES", "UNKNOWN"]).optional(),
  embeddable: z.boolean().optional(),
  publicDomain: z.boolean().optional(),
  textToSpeechPermission: z.string().optional(),
  epub: z
    .object({
      isAvailable: z.boolean().optional(),
      acsTokenLink: z.string().optional(),
      downloadLink: z.string().optional(),
    })
    .optional(),
  pdf: z
    .object({
      isAvailable: z.boolean().optional(),
      acsTokenLink: z.string().optional(),
      downloadLink: z.string().optional(),
    })
    .optional(),
  webReaderLink: z.string().optional(),
  accessViewStatus: z.string().optional(),
  quoteSharingAllowed: z.boolean().optional(),
})

// Search Info
export const searchInfoSchema = z.object({
  textSnippet: z.string().optional(),
})

// Complete Volume schema
export const volumeSchema = z.object({
  kind: z.string(),
  id: z.string(),
  etag: z.string().optional(),
  selfLink: z.string().optional(),
  volumeInfo: volumeInfoSchema,
  saleInfo: saleInfoSchema.optional(),
  accessInfo: accessInfoSchema.optional(),
  searchInfo: searchInfoSchema.optional(),
})

// Volumes List Response
export const volumesResponseSchema = z.object({
  kind: z.string(),
  totalItems: z.number(),
  items: z.array(volumeSchema).optional(),
})

// Inferred Types
export type IndustryIdentifier = z.infer<typeof industryIdentifierSchema>
export type ImageLinks = z.infer<typeof imageLinksSchema>
export type VolumeInfo = z.infer<typeof volumeInfoSchema>
export type SaleInfo = z.infer<typeof saleInfoSchema>
export type AccessInfo = z.infer<typeof accessInfoSchema>
export type Volume = z.infer<typeof volumeSchema>
export type VolumesResponse = z.infer<typeof volumesResponseSchema>

// Request parameter types
export interface VolumeGetParams {
  volumeId: string
  projection?: "full" | "lite"
  country?: string
}

export interface VolumesListParams {
  q: string
  maxResults?: number
  startIndex?: number
  orderBy?: "newest" | "relevance"
  filter?: "ebooks" | "free-ebooks" | "full" | "paid-ebooks" | "partial"
  langRestrict?: string
  printType?: "all" | "books" | "magazines"
  projection?: "full" | "lite"
}

// Helper functions to extract data from volumes
export function getBookISBN13(volume: Volume): string | null {
  const identifier = volume.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
  return identifier?.identifier ?? null
}

export function getBookISBN10(volume: Volume): string | null {
  const identifier = volume.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
  return identifier?.identifier ?? null
}

export function getBookThumbnail(volume: Volume): string | null {
  return volume.volumeInfo.imageLinks?.thumbnail ?? null
}

export function getBookAuthors(volume: Volume): string {
  return volume.volumeInfo.authors?.join(", ") ?? "Unknown Author"
}
