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
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { SelectTag } from "@/components/SelectTag";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getBlogSchema } from "@/utils/blogSchema.js";
import api from "@/api/axiosInstance";
import { updateBlog, getOneBlog } from "@/api/fetchBlogs";
import SelectCategory from "@/components/SelectCategory";
import LoadingV1 from "@/components/LoadingV1";

export const Route = createFileRoute("/_dashboard/blogs/edit/$id")({
  component: EditBlog,
});

// TODO: fix updating blog
function EditBlog() {
  const [blogContent, setBlogContent] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImage] = useState([]);

  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/blogs/update" });
  const { id } = Route.useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getOneBlog(id),
  });

  const blogSchema = getBlogSchema();
  const form = useForm({
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

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        author: blog.author || "",
        tags: blog.tags || [],
        coverImage: blog.coverImage || "",
        categoryId: blog.categoryId || "",
      });
      setBlogContent(blog.content);
    }
  }, [blog, form]);

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => updateBlog(id, updatedBlog),
    onSuccess: () => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate({ to: "/blogs" });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const trackDroppedImage = (blobUrl, file) => {
    setImage((prev) => [...prev, { blobUrl, file }]);
  };

  const updateBlogHandler = async (blog) => {
    // const uploadedImages = await Promise.all(
    //   images.map(async (image) => {
    //     const formdata = new FormData();
    //     formdata.append("img", image.file);

    //     const res = await api.post(
    //       "http://localhost:8000/api/v1/upload",
    //       formdata,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
    //     return {
    //       blobUrl: image.blobUrl,
    //       serverUrl: res.data.imageUrl,
    //     };
    //   })
    // );
    // uploadedImages.forEach(({ blobUrl, serverUrl }) => {
    //   blog.content = blog.content.replace(blobUrl, serverUrl);
    // });
    // blog.images = uploadedImages.map((image) => image.serverUrl);
    blog.tags = selectedTags;
    blog.content = blogContent;
    console.log(blog);
    updateBlogMutation.mutate(blog);
  };

  if (isLoading) return <LoadingV1 />;
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updateBlogHandler)}
          encType="multipart/form-data"
        >
          <div className="container mx-auto max-w-screen-lg mt-20 pb-10">
            <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Update Blog
            </h1>
            <Card className="container max-w-screen-md mx-auto mt-10">
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
                            id="title"
                            placeholder="Post title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            placeholder="Author name"
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
                            onChange={field.onChange}
                            content={blogContent}
                            setBlogContent={setBlogContent}
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
                </div>
              </CardContent>
            </Card>

            {/* properties */}
            <Card className="container max-w-screen-md mx-auto mt-10">
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

            <div className="container max-w-screen-md mx-auto mt-10 flex gap-6 p-0">
              <Button
                type="submit"
                disabled={updateBlogMutation.isPending ? true : false}
              >
                {updateBlogMutation.isPending ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )}
                {updateBlogMutation.isPending ? "Please wait" : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
