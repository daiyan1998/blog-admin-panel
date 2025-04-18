import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/Tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SelectTag } from "@/components/SelectTag";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getBlogSchema } from "@/utils/blogSchema.js";
import api from "@/api/axiosInstance";
import { createBlog } from "@/api/fetchBlogs";
import SelectCategory from "@/components/SelectCategory";

export const Route = createFileRoute("/_dashboard/blogs/create")({
  component: CreateBlog,
});

function CreateBlog() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/blogs/create" });
  const [images, setImage] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);

  const blogSchema = getBlogSchema();
  const form = useForm({
    resolver: zodResolver(blogSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      author: "",
      content: "",
      tags: [],
      coverImage: "",
      categoryId: "",
    },
  });

  const postBlog = useMutation({
    mutationFn: (newBlog) => createBlog(newBlog),
    onSuccess: () => {
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate({ to: "/blogs" });
    },
    onError: (error) => {
      if (error.status === 403) {
        toast.error("You don't have permission to create a blog");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const trackDroppedImage = (blobUrl, file) => {
    setImage((prev) => [...prev, { blobUrl, file }]);
  };
  const createBlogHandler = async (blog) => {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const formdata = new FormData();
        formdata.append("img", image.file);

        const res = await api.post(
          "http://localhost:8000/api/v1/upload",
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return {
          blobUrl: image.blobUrl,
          serverUrl: res.data.imageUrl,
        };
      })
    );
    uploadedImages.forEach(({ blobUrl, serverUrl }) => {
      blog.content = blog.content.replace(blobUrl, serverUrl);
    });
    blog.images = uploadedImages.map((image) => image.serverUrl);
    blog.tags = selectedTags;
    postBlog.mutate(blog);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createBlogHandler)}
          encType="multipart/form-data"
        >
          <div className="container mx-auto max-w-screen-lg mt-20 pb-10">
            <h1 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Create Blog
            </h1>
            <Card className="container max-w-screen-md  mx-auto mt-10">
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Title, author, image...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  {/* title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Post title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* description */}
                  {/* author */}
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
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
                  {/* TipTap */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="content" className="font-bold">
                          Content
                        </Label>
                        <FormControl>
                          <Tiptap
                            content={field.content}
                            onChange={field.onChange}
                            trackDroppedImage={trackDroppedImage}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* cover image */}
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <Input
                            id="coverImage"
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
                  <div className="flex flex-col space-y-1.5"></div>
                </div>
              </CardContent>
            </Card>
            {/* properties */}
            <Card className="container max-w-screen-md  mx-auto mt-10">
              <CardHeader>
                <CardTitle>Properties</CardTitle>
                <CardDescription>
                  Additional functions and attributes...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SelectTag
                  form={form}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field: { onChange } }) => (
                    <SelectCategory
                      onChange={onChange}
                      value={form.control._formValues.categoryId}
                    />
                  )}
                />
              </CardContent>
            </Card>
            <div className="container max-w-screen-md  mx-auto mt-10 flex gap-6 p-0">
              <Button
                type="submit"
                disabled={postBlog.isPending ? true : false}
              >
                {postBlog.isPending ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )}
                {postBlog.isPending ? "Please wait" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
