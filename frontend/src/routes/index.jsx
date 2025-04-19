import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

export const Route = createFileRoute("/")({
  component: Login,
});

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function Login() {
  const [user, setUser] = useState();
  const navigate = Route.useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    api
      .post("/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(JSON.parse(localStorage.getItem("user")));
        toast.success(response.data.message, {
          duration: 5000,
        });
        navigate({ to: "/blogs" });
      })
      .catch(function (error) {
        toast.error("Login Failed", {
          duration: 5000,
        });
      });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div>
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-[400px]"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="xyz@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <Link to="/register">
          Already have an account?{" "}
          <span className="text-blue-500">register</span>
        </Link>
      </div>
    </div>
  );
}
