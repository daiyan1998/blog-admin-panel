import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import LoadingV1 from "@/components/LoadingV1";
import { getOneBlog } from "@/api/fetchBlogs";
import { CommentSection } from "@/components/comment/CommentSection";
export const Route = createFileRoute("/_dashboard/blogs/$id")({
  component: Blog,
});

function Blog() {
  const { id } = Route.useParams();
  // const [blog, setBlog] = useState();

  const {
    isPending,
    error,
    data: blog,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: () => getOneBlog(id),
  });

  if (isPending) {
    return <LoadingV1 />;
  }

  const handleImgError = (event) => {
    event.target.src =
      "https://images.unsplash.com/photo-1685367024091-12959d6430ef?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Fallback image URL
  };

  return (
    <div className="container mx-auto py-10 break-words">
      <div className="flex justify-between mb-9">
        <Button variant="ghost" onClick={() => history.back()}>
          <ChevronLeft className="mr-4" /> Back
        </Button>
        <Link to={`/blogs/edit/${id}`}>
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
        </Link>
      </div>
      {/* Cover image */}
      <div className="w-full h-[400px]">
        <img
          src={blog?.coverImage}
          alt="Image"
          className="rounded-md object-cover h-full w-full"
          onError={handleImgError}
          loading="lazy"
        />
      </div>
      {/* title,details */}
      <section className="max-w-screen-md mx-auto my-20">
        <div className="flex items-center gap-2 mb-9">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold ">{blog?.author}</div>
            <div>{blog?.createdAt.split("T")[0]}</div>
          </div>
        </div>
        <h1 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {blog.title}
        </h1>
        <p>
          <span className="font-bold">Category: </span>{" "}
          <span>{blog.category?.name || "Uncategorized"}</span>
        </p>
        <p>
          <span className="font-bold">Description: </span> {blog?.description}
        </p>
        <article
          className="mt-10 tiptap"
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        ></article>
      </section>
      <CommentSection blogId={id} />
    </div>
  );
}
