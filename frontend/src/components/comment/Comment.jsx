import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useCreateComment, useDeleteComment } from "@/api/fetchComments";
import Tiptap from "../Tiptap";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

export function Comment({ comment, onReply, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const deleteComment = useDeleteComment();

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const handleReply = (content) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleDelete = () => {
    console.log({ comment }, "comment");
    onDelete(comment.id);
    // deleteComment.mutate(comment.id);
  };

  return (
    <div className="flex space-x-3 pb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.user.image} alt={comment.user.name} />
        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 mb-1">
          {/* <p className="font-semibold">{comment.user.name}</p> */}
          <p
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          ></p>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Button variant="ghost" size="sm" className="px-2">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Reply
          </Button>
          <Button
            onClick={() => onDelete(comment.id)}
            variant="ghost"
            size="sm"
          >
            Delete
          </Button>
          <span className="mx-2">·</span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>
        {isReplying && (
          <div className="mt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleReply)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Tiptap
                          content={field.content}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-center">
                  <Button type="submit">Post Reply</Button>
                  <Button onClick={() => setIsReplying(!isReplying)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        {comment.replies?.length > 0 && (
          <div className="mt-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
