import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export interface IProps {
  children: JSX.Element | Array<JSX.Element> | string | null;
}

export default function Layout({ children }: IProps): JSX.Element {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
      </QueryClientProvider>
    </>
  );
}
