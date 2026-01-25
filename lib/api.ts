export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
      errorData
    )
  }

  return response.json()
}
