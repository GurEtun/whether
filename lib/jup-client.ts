import { NextRequest, NextResponse } from "next/server"

export const JUP_BASE_URL = "https://api.jup.ag"
export const JUP_PREDICTION_URL = "https://prediction-market-api.jup.ag"

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
 * Fetch from upstream Jupiter API with proper error handling
 */
export async function upstreamFetch(
  path: string,
  req: NextRequest,
  init?: RequestInit,
  baseUrl: string = JUP_PREDICTION_URL
): Promise<NextResponse> {
  const url = buildUrl(path, req, baseUrl)
  const method = init?.method || req.method
  const apiKey = getApiKey()

  try {
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
    if ((method === "POST" || method === "DELETE") && !init?.body) {
      try {
        const body = await req.text()
        if (body) {
          fetchInit.body = body
        }
      } catch {
        // No body or already consumed, continue without
      }
    }

    const response = await fetch(url, fetchInit)

    if (!response.ok) {
      let errorDetails: unknown
      try {
        errorDetails = await response.json()
      } catch {
        errorDetails = await response.text()
      }
      
      return errorResponse(
        `Upstream API error: ${response.statusText}`,
        response.status,
        errorDetails
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch from upstream API", 500, { message })
  }
}

/**
 * Direct fetch from Jupiter API (for server-side use)
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
  const url = new URL(path, baseUrl)
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
    throw new Error(`Jupiter API error: ${response.status} ${response.statusText}`)
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
