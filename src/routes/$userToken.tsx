import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute("/$userToken").createRoute({
  component: lazyRouteComponent(
    () => import("@/routes/index.component"),
    "component",
  ),
});
