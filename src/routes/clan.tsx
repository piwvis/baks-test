import { FileRoute, Outlet } from "@tanstack/react-router";

export const Route = new FileRoute("/clan").createRoute({
  component: ClanComponent,
});

function ClanComponent() {
  return (
    <section className="flex justify-center items-center flex-col">
      <Outlet />
    </section>
  );
}
