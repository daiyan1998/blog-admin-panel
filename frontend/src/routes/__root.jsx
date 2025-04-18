import { useAuthStore } from "@/store";
import {
  createRootRoute,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext()({
  component: App,
});

function App() {
  const { user, logout } = useAuthStore();
  const navigate = Route.useNavigate();
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user]);
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );
}
