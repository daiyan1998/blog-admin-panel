import api from "./axiosInstance";

export async function getTags() {
  return api.get("/tags").then((res) => res.data.data);
}

export async function createTag(data) {
  return api.post("/tags", data).then((res) => res.data.data);
}

export async function updateTag(id, data) {
  return api.patch(`/tags/${id}`, data).then((res) => res.data.data);
}

export async function deleteTag(id) {
  return api.delete(`/tags/${id}`).then((res) => res.data.data);
}
