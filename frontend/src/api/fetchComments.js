import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axiosInstance";

// export async function getComments(blogId) {
//   return api.get(`/comments/${blogId}`).then((res) => res.data.data);
// }

// export async function createComment(data) {
//   return api.post("/comments", data).then((res) => res.data.data);
// }

// export async function updateComment(commentId, data) {
//   return api.put(`/comments/${commentId}`, data).then((res) => res.data.data);
// }

// export async function deleteComment(commentId) {
//   return api.delete(`/comments/${commentId}`).then((res) => res.data.data);
// }

export function useComments(blogId) {
  return useQuery({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const res = await api.get(`/comments/${blogId}`);
      return res.data.data;
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/comments", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, data }) => {
      const res = await api.put(`/comments/${commentId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      const res = await api.delete(`/comments/${commentId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
}
