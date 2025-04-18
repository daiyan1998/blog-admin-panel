import api from "./axiosInstance";

export async function getCategories() {
  return api.get("/categories").then((res) => res.data.data);
}

export async function createCategory(data) {
  return api.post("/categories", data).then((res) => res.data.data);
}

export async function updateCategory(id, data) {
  return api.patch(`/categories/${id}`, data).then((res) => res.data.data);
}

export async function deleteCategory(id) {
  return api.delete(`/categories/${id}`).then((res) => res.data.data);
}
