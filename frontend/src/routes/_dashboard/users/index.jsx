import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingV1 from "@/components/LoadingV1";
import api from "@/api/axiosInstance";

export const Route = createFileRoute("/_dashboard/users/")({
  component: () => {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ["users"], exact: true });

    const { data: users, isLoading } = useQuery({
      queryKey: ["users"],
      queryFn: () => api.get("/users").then((res) => res.data.data),
    });

    const { mutate: deleteBlogQuery, isError } = useMutation({
      mutationFn: (id) => {
        return api.delete(`/users/${id}`);
      },
      onSuccess: () => {
        toast.success("User deleted successfully");
      },
    });

    const deleteUserHandler = (id) => {
      deleteBlogQuery(id);
    };

    if (isLoading) {
      return <LoadingV1 />;
    }

    return (
      <div className="container mx-auto py-10">
        <h1 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-7">
          Users
        </h1>
        <Table>
          <TableCaption>A list of your users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead className="w-[500px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger>
                      <Pencil className="h-4 w-4 cursor-pointer " />
                    </DialogTrigger>
                    <DialogContent>
                      <UpdateForm user={user} />
                    </DialogContent>
                  </Dialog>

                  <Trash
                    onClick={() => deleteUserHandler(user.id)}
                    className="h-4 w-4 cursor-pointer text-red-600"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
});

const UpdateForm = ({ user }) => {
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

  const VALID_IMAGE_TYPES = ["jpeg", "jpg", "png", "gif", "webp"];

  const formSchema = z.object({
    name: z.string().trim().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .or(z.literal(""))
      .optional(),
    // .refine((val) => !val || val.length >= 8, {
    //   message: "Password must be at least 8 characters.",
    // }),
    role: z.string(),
    img: z
      .any()
      .optional()
      .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
        message: `Image size must be less than ${MAX_IMAGE_SIZE} bytes.`,
      })
      .refine(
        (file) =>
          !file || VALID_IMAGE_TYPES.includes(file.type.split("/").pop()),
        {
          message: `Invalid image type. Only ${VALID_IMAGE_TYPES.join(", ")} are allowed.`,
        }
      ),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      role: user?.role,
      img: null,
    },
  });
  const updateUserHandler = async (data) => {
    axios
      .patch(`http://localhost:8000/api/v1/users/${user.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        toast.success(response.data.message, {
          duration: 5000,
        });
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
          onSubmit={form.handleSubmit(updateUserHandler)}
          encType="multipart/form-data"
        >
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
                        <Input id="name" placeholder="john doe" {...field} />
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
                        <Input id="author" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* photo */}
                <FormField
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
                />
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
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
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
        </form>
      </Form>
    </>
  );
};
