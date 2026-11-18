import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "../i18n/locale";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

interface ProviderProps {
  children: React.ReactNode;
}

// App-level providers — QueryClientProvider must stay (all API calls run through TanStack Query).
export function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>{children}</LocaleProvider>
    </QueryClientProvider>
  );
}
