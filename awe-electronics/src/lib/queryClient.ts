import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Throws an error if the response from the server is not OK (status 2xx).
 * Used for RESTful error handling.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Generic function to make a RESTful API request using fetch.
 * - Supports GET, POST, PUT, DELETE, etc.
 * - Automatically sets JSON headers when a body is provided.
 * - Ensures credentials (e.g., cookies) are sent with requests.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method, // RESTful method (e.g., GET, POST, PUT, DELETE)
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined, // Send body as JSON if present
    credentials: "include", // Include cookies/session credentials
  });

  await throwIfResNotOk(res); // Handle HTTP errors from REST service
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Returns a QueryFunction for React Query to fetch data from a RESTful endpoint.
 * - Uses fetch to retrieve resource from the given URL.
 * - Optional handling for 401 Unauthorized responses.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // Send session cookie for authentication
    });

    // Gracefully handle unauthorized access if specified
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res); // Throw if non-OK status from REST API
    return await res.json();    // Parse JSON body from response
  };

/**
 * React Query client configured for working with a RESTful backend.
 * - Disables automatic refetching and retries.
 * - Treats data as always fresh (infinite staleTime).
 * - Uses our custom query function for GET requests.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // Default RESTful query
      refetchInterval: false,       // Do not poll
      refetchOnWindowFocus: false,  // Do not auto-refresh on tab focus
      staleTime: Infinity,          // Treat queries as always fresh
      retry: false,                 // Do not retry failed requests
    },
    mutations: {
      retry: false, // Mutations also won't retry on failure
    },
  },
});
