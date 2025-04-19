import { create } from "zustand";
import { toast } from "sonner";
import api from "./api/axiosInstance";

const useAuthStore = create((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  setUser: (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    set({ user: newUser });
  },

  login: async (data, navigate) => {
    try {
      const response = await api.post("/users/login", data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      const user = response.data.user;
      if (!user) {
        toast.error("Login Failed", { duration: 5000 });
        return;
      }
      set((state) => ({
        user: user,
      }));
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(response.data.message, { duration: 5000 });
      navigate({ to: "/blogs" });
    } catch (error) {
      console.error(error);
      toast.error("Login Failed", { duration: 5000 });
    }
  },

  logout: async (navigate) => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("user");
      set({ user: null });
      toast.success("Logged out successfully", { duration: 5000 });
      navigate({ to: "/login" });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed", { duration: 5000 });
    }
  },
}));

export { useAuthStore };
