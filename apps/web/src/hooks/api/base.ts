import { useAccount } from '@getpara/react-sdk'
import { useSessionToken } from '../use-session'
import { useReferralCode } from '../useReferralCode'

export class ApiClient {
  private baseURL: string = ''

  constructor() {
    this.baseURL = typeof window !== 'undefined' ? window.location.origin : ''
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new ApiError(errorData.message || 'Request failed', response.status)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred')
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiClient = new ApiClient()

export function useApiWithAuth() {
  const { session } = useSessionToken()
  const { referralCode } = useReferralCode()
  const account = useAccount()
  const requestWithAuth = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const authHeaders: HeadersInit = {}

    if (session) {
      authHeaders['x-para-session'] = session
    }

    // Include referral code if available
    if (referralCode) {
      authHeaders['x-referral-code'] = referralCode
    }

    console.log('account.embedded.email', account.embedded.email)

    if (account.embedded.email) {
      authHeaders['x-email'] = account.embedded.email
    }

    return apiClient.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    })
  }

  return {
    get: <T>(endpoint: string, options?: RequestInit) => requestWithAuth<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
      requestWithAuth<T>(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
      requestWithAuth<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
      requestWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
  }
}
