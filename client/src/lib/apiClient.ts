import { supabase } from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const headers = new Headers(options.headers || {});
  
  // Set JSON content-type unless FormData is being sent
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = responseData.error || responseData.message || `HTTP Error ${response.status}`;
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.details = responseData.details;
    throw error;
  }

  return responseData as T;
}

export const apiClient = {
  get: <T = any>(endpoint: string) => fetchWithAuth<T>(endpoint, { method: "GET" }),
  post: <T = any>(endpoint: string, body?: any) =>
    fetchWithAuth<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T = any>(endpoint: string, body?: any) =>
    fetchWithAuth<T>(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T = any>(endpoint: string) => fetchWithAuth<T>(endpoint, { method: "DELETE" }),
};
