import React from "react";
import { Button } from "./ui/button";
import { FolderPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function EmptyState() {
  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center gap-2">
      <FolderPlus className="h-16 w-16" />
      <p className="text-2xl font-bold">No blogs</p>
      <p>Get started by creating a new blog</p>

      <Button>
        <Link to="/blogs/create">New Blog</Link>
      </Button>
    </div>
  );
}
