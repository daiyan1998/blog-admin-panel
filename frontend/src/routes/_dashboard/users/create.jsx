import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/axiosInstance";

export const Route = createFileRoute("/_dashboard/users/create")({
  component: () => {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

    const VALID_IMAGE_TYPES = ["jpeg", "jpg", "png", "gif", "webp"];

    const formSchema = z.object({
      name: z.string().trim().min(2, {
        message: "Name must be at least 2 characters.",
      }),
      email: z.string().email({
        message: "Please enter a valid email.",
      }),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      role: z.string(),
      // img: z
      //   .custom((file) => file instanceof File)
      //   .optional()
      //   .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      //     message: `Image size must be less than ${MAX_IMAGE_SIZE} bytes.`,
      //   })
      //   .refine(
      //     (file) => VALID_IMAGE_TYPES.includes(file.type.split("/").pop()),
      //     {
      //       message: `Invalid image type. Only ${VALID_IMAGE_TYPES.join(", ")} are allowed.`,
      //     }
      //   ),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        password: "",
        role: "",
        // img: null,
      },
    });

    const createUserHandler = async (data) => {
      api
        .post("/users/register", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          toast.success(response.data.message, {
            duration: 5000,
          });
          // navigate({ to: "/users" });
        })
        .catch(function (error) {
          toast.error("User Creation Failed", {
            duration: 5000,
          });
        });
    };

    return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createUserHandler)}
            encType="multipart/form-data"
          >
            <div className="container mx-auto max-w-screen-lg mt-20 pb-10">
              <h1 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Create User
              </h1>
              <Card className="container max-w-screen-md  mx-auto mt-10">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>
                    Provide some basic details about the user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    {/* name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              placeholder="john doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="VWwvz@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              id="author"
                              placeholder="Jhon Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* photo */}
                    {/* <FormField
                      control={form.control}
                      name="img"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <Input
                              id="img"
                              placeholder="Post image"
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    {/* select role */}
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col space-y-1.5"></div>
                  </div>
                </CardContent>
              </Card>
              <div className="container max-w-screen-md  mx-auto mt-10 flex gap-6 p-0">
                <Button type="submit">submit</Button>
                {/* <Button
                  type="submit"
                  disabled={postBlog.isPending ? true : false}
                >
                  {postBlog.isPending ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    ""
                  )}
                  {postBlog.isPending ? "Please wait" : "Create"}
                </Button> */}
              </div>
            </div>
          </form>
        </Form>
      </>
    );
  },
});
