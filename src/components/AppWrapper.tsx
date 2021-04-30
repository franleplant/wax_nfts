import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Layout({ children }: any) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
      </QueryClientProvider>
    </>
  );
}
