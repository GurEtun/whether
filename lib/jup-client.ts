import { NextRequest, NextResponse } from "next/server"

export const JUP_BASE_URL = "https://api.jup.ag"
export const JUP_PREDICTION_URL = "https://api.jup.ag"

/**
 * Get Jupiter API key from environment
 */
function getApiKey(): string {
  return process.env.JUPITER_API_KEY || ""
}

/**
 * Build upstream URL with forwarded query params
 */
export function buildUrl(path: string, req: NextRequest, baseUrl: string = JUP_PREDICTION_URL): string {
  const url = new URL(path, baseUrl)
  const searchParams = req.nextUrl.searchParams
  
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })
  
  return url.toString()
}

/**
 * Normalized error response format
 */
export interface NormalizedError {
  error: string
  status: number
  details?: unknown
}

/**
 * Create CORS headers for API responses
 */
export function getCorsHeaders(): HeadersInit {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  }
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleOptions(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  })
}

/**
 * Create a normalized error response
 */
export function errorResponse(
  error: string,
  status: number,
  details?: unknown
): NextResponse<NormalizedError> {
  return NextResponse.json(
    { error, status, details },
    { status, headers: getCorsHeaders() }
  )
}

/**
 * Fetch from upstream Jupiter Prediction API (raw Response for route handlers to process)
 */
export async function upstreamFetch(
  path: string,
  req?: NextRequest,
  init?: RequestInit,
  baseUrl: string = JUP_PREDICTION_URL
): Promise<Response> {
  const url = req ? buildUrl(path, req, baseUrl) : new URL(path, baseUrl).toString()
  const method = init?.method || req?.method || "GET"
  const apiKey = getApiKey()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Whether-Prediction-Market/1.0",
    ...(apiKey && { "x-api-key": apiKey }),
  }

  const fetchInit: RequestInit = {
    method,
    headers,
    ...init,
  }

  // For POST/DELETE, pass through the body
  if ((method === "POST" || method === "DELETE") && !init?.body && req) {
    try {
      const body = await req.text()
      if (body) {
        fetchInit.body = body
      }
    } catch {
      // No body or already consumed, continue without
    }
  }

  return fetch(url, fetchInit)
}

/**
 * Direct fetch from Jupiter Prediction API (for server-side use)
 * Automatically prefixes paths with /prediction/v1
 */
export async function jupiterFetch<T>(
  path: string,
  options?: {
    method?: string
    body?: unknown
    baseUrl?: string
    params?: Record<string, string>
  }
): Promise<T> {
  const baseUrl = options?.baseUrl || JUP_PREDICTION_URL
  // Ensure path uses the correct /prediction/v1 prefix
  const normalizedPath = path.startsWith("/prediction/v1")
    ? path
    : path.replace(/^\/api\/v1/, "/prediction/v1")
  const url = new URL(normalizedPath, baseUrl)
  const apiKey = getApiKey()
  
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(apiKey && { "x-api-key": apiKey }),
    },
    ...(options?.body && { body: JSON.stringify(options.body) }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw new Error(`Jupiter API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

/**
 * Extract dynamic route param from request URL
 */
export function getRouteParam(req: NextRequest, paramName: string): string | null {
  const url = new URL(req.url)
  const pathParts = url.pathname.split("/")
  
  const jupIndex = pathParts.indexOf("jup")
  if (jupIndex === -1) return null
  
  return pathParts[pathParts.length - 1] || null
}
