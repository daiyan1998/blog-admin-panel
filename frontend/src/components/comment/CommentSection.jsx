"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from "@/api/fetchComments";
import { Comment } from "./Comment";

export function CommentSection({ blogId }) {
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading, isError } = useComments(blogId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment.mutate({ blogId, content: newComment });
    setNewComment("");
  };

  const handleReply = (parentId, content) => {
    createComment.mutate({
      blogId: blogId,
      parentCommentId: parentId,
      content: content.content,
    });
  };

  const handleDelete = (commentId) => {
    deleteComment.mutate(commentId);
  };

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>Error loading comments</p>;
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Current User"
            />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full"
              rows={3}
            />
            <Button type="submit" className="mt-2">
              Post Comment
            </Button>
          </div>
        </div>
      </form>
      {comments.map((comment) => (
        // <CommentList comment={comment} onReply={handleReply} />
        <Comment
          key={comment.id}
          comment={comment}
          onReply={handleReply}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
