import axios, { AxiosInstance, AxiosError } from "axios"
import {
  volumeSchema,
  volumesResponseSchema,
  type Volume,
  type VolumesResponse,
  type VolumeGetParams,
  type VolumesListParams,
} from "./types"

const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1"

class GoogleBooksApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = "GoogleBooksApiError"
  }
}

class GoogleBooksClient {
  private client: AxiosInstance
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_BOOKS_API_KEY
    this.client = axios.create({
      baseURL: GOOGLE_BOOKS_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  /**
   * Get a single volume by ID
   */
  async getVolume(params: VolumeGetParams): Promise<Volume> {
    try {
      const response = await this.client.get(`/volumes/${params.volumeId}`, {
        params: {
          ...(params.projection && { projection: params.projection }),
          ...(params.country && { country: params.country }),
          ...(this.apiKey && { key: this.apiKey }),
        },
      })

      const parsed = volumeSchema.safeParse(response.data)
      if (!parsed.success) {
        throw new GoogleBooksApiError(
          `Invalid response from Google Books API: ${parsed.error.message}`
        )
      }

      return parsed.data
    } catch (error) {
      if (error instanceof GoogleBooksApiError) throw error
      if (error instanceof AxiosError) {
        throw new GoogleBooksApiError(
          error.response?.data?.error?.message || error.message,
          error.response?.status,
          error
        )
      }
      throw new GoogleBooksApiError("Unknown error occurred", undefined, error as Error)
    }
  }

  /**
   * Search for volumes
   */
  async listVolumes(params: VolumesListParams): Promise<VolumesResponse> {
    try {
      const response = await this.client.get("/volumes", {
        params: {
          q: params.q,
          ...(params.maxResults && { maxResults: params.maxResults }),
          ...(params.startIndex && { startIndex: params.startIndex }),
          ...(params.orderBy && { orderBy: params.orderBy }),
          ...(params.filter && { filter: params.filter }),
          ...(params.langRestrict && { langRestrict: params.langRestrict }),
          ...(params.printType && { printType: params.printType }),
          ...(params.projection && { projection: params.projection }),
          ...(this.apiKey && { key: this.apiKey }),
        },
      })

      const parsed = volumesResponseSchema.safeParse(response.data)
      if (!parsed.success) {
        throw new GoogleBooksApiError(
          `Invalid response from Google Books API: ${parsed.error.message}`
        )
      }

      return parsed.data
    } catch (error) {
      if (error instanceof GoogleBooksApiError) throw error
      if (error instanceof AxiosError) {
        throw new GoogleBooksApiError(
          error.response?.data?.error?.message || error.message,
          error.response?.status,
          error
        )
      }
      throw new GoogleBooksApiError("Unknown error occurred", undefined, error as Error)
    }
  }

  /**
   * Search for a book by ISBN
   */
  async getBookByISBN(isbn: string): Promise<Volume | null> {
    const cleanISBN = isbn.replace(/-/g, "")
    const response = await this.listVolumes({
      q: `isbn:${cleanISBN}`,
      maxResults: 1,
    })

    return response.items?.[0] ?? null
  }

  /**
   * Search for books by title
   */
  async searchByTitle(title: string, maxResults = 10): Promise<VolumesResponse> {
    return this.listVolumes({
      q: `intitle:${title}`,
      maxResults,
    })
  }

  /**
   * Search for books by author
   */
  async searchByAuthor(author: string, maxResults = 10): Promise<VolumesResponse> {
    return this.listVolumes({
      q: `inauthor:${author}`,
      maxResults,
    })
  }

  /**
   * General book search
   */
  async search(query: string, options?: Partial<VolumesListParams>): Promise<VolumesResponse> {
    return this.listVolumes({
      q: query,
      maxResults: 10,
      ...options,
    })
  }
}

// Singleton instance
let googleBooksClient: GoogleBooksClient | null = null

/**
 * Get the Google Books API client instance
 */
export function getGoogleBooksClient(apiKey?: string): GoogleBooksClient {
  if (!googleBooksClient) {
    googleBooksClient = new GoogleBooksClient(apiKey)
  }
  return googleBooksClient
}

// Export class for custom instances
export { GoogleBooksClient, GoogleBooksApiError }
