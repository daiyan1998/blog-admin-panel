import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ellipsis, Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmptyState from "@/components/EmptyState";
import LoadingV1 from "@/components/LoadingV1";
import { toast } from "sonner";
import { PaginationV1 } from "@/components/PaginationV1";
import { SearchBlog } from "@/components/SearchBlog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBlog, getBlogs } from "@/api/fetchBlogs";
import ErrorMessage from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import api from "@/api/axiosInstance";
import SelectCategory from "@/components/SelectCategory";
import { Controller, Form, FormProvider, useForm } from "react-hook-form";
import SelectSingleTag from "@/components/SelectSingleTag";
import { BASE_URL } from "@/lib/constants";

export const Route = createFileRoute("/_dashboard/blogs/")({
  component: () => {
    const [blogs, setBlogs] = useState();
    const { page } = Route.useSearch();
    const queryClient = useQueryClient();

    const form = useForm({
      defaultValues: {
        categoryId: "",
        tagId: "",
      },
    });

    // set current page based on url
    const [currentPage, setCurrentPage] = useState(page || 1);
    const [pages, setPages] = useState(1);

    const { data, isLoading, isError } = useQuery({
      queryKey: ["blogs", currentPage],
      queryFn: () => getBlogs(currentPage),
    });
    useEffect(() => {
      if (data) {
        setBlogs(data.data);
        setPages(data.pages);
      }
    }, [data]);

    const deleteBlogQuery = useMutation({
      mutationFn: (id) => deleteBlog(id),
      onSuccess: () => {
        toast.success("Blog deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });

        setTimeout(() => {
          if (blogs.length === 1 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          }
        }, 100);
      },

      onError: (error) => {
        if (error.status === 403) {
          return toast.error("You don't have permission to delete this blog");
        } else {
          return toast.error("Something went wrong");
        }
      },
    });
    const deleteBlogHandler = (id) => deleteBlogQuery.mutate(id);
    const handleImgError = (event) => {
      event.target.src = "alter.jpg";
    };

    const formateDate = (date) =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date));
    const blogSearchHandler = async (searchData) => {
      try {
        const response = await getBlogs(currentPage, searchData);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (isLoading) {
      return <LoadingV1 />;
    }
    if (isError) {
      return <ErrorMessage />;
    }

    return (
      <div className="py-10 h-[90vh] flex flex-col justify-between">
        <div className="">
          <h1 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-7">
            Blog
          </h1>
          <SearchBlog />
          <FormProvider {...form}>
            <form
              className="flex gap-4 my-6"
              onSubmit={form.handleSubmit(blogSearchHandler)}
            >
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
              <Controller
                control={form.control}
                name="tagId"
                render={({ field: { onChange } }) => (
                  <SelectSingleTag
                    onChange={onChange}
                    value={form.control._formValues.tagId}
                  />
                )}
              />
              <Button type="submit">Search</Button>
            </form>
          </FormProvider>
          {blogs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <EmptyState
                title="No Blogs Found"
                description="Looks like you haven't created any blogs yet."
                className="w-full flex flex-col items-center justify-center"
                link="/blogs/create"
                buttonText="Create Blog"
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {blogs?.map((blog) => (
                <Card className="w-full h-[250px] flex" key={blog.id}>
                  <div className="flex flex-grow flex-col p-4">
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        Published on:{" "}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">
                        {formateDate(blog.createdAt)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        Updated on:{" "}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">
                        {formateDate(blog.updatedAt)}
                      </span>
                    </div>
                    <Link to={`/blogs/${blog.id}`}>
                      <CardHeader className="hover:underline overflow-hidden py-4 px-0">
                        <CardTitle>{blog.title}</CardTitle>
                        <CardDescription
                          className="break-all line-clamp-2 relative overflow-hidden h-[calc(2*1.5rem)] leading-6"
                          dangerouslySetInnerHTML={{ __html: blog?.content }}
                        ></CardDescription>
                      </CardHeader>
                    </Link>
                    <CardFooter className="flex justify-between mt-auto p-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline" size="icon" asChild>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link to={`/blogs/${blog.id}`}>
                              <Button variant="ghost">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/blogs/edit/${blog.id}`}>
                              <Button variant="ghost">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => deleteBlogHandler(blog.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* catergory */}
                      <div className="flex gap-2">
                        <div className="flex gap-2">
                          {blog.tags?.map(({ tag }) => (
                            <Badge variant="secondary" key={tag.id}>
                              #{tag.name}
                            </Badge>
                          ))}
                        </div>
                        <Badge>{blog.category?.name || "Uncategorized"}</Badge>
                      </div>
                    </CardFooter>
                  </div>
                  <div className="w-[180px] p-2 md:flex-none">
                    <img
                      src={`${BASE_URL}/${blog.coverImage}`}
                      className="object-cover h-full w-full rounded-lg"
                      loading="lazy"
                      onError={handleImgError}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <PaginationV1
          setPage={setCurrentPage}
          currentPage={currentPage}
          pages={pages}
          setPages={setPages}
        />
      </div>
    );
  },
});
