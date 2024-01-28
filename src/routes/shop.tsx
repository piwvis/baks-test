import { FileRoute, Outlet } from "@tanstack/react-router";

export const Route = new FileRoute("/shop").createRoute({
  component: ShopComponent,
});

function ShopComponent() {
  return (
    <section className="flex justify-center items-center flex-col">
      <Outlet />
    </section>
  );
}
