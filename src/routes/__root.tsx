import { rootRouteWithContext } from "@tanstack/react-router";
import "@/index.css";
import { QueryClient } from "@tanstack/react-query";
import Root from "@/components/root";

export const Route = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Root,
});
