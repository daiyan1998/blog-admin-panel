import api from "./axiosInstance";

// get all blogs
export async function getBlogs(page, data = {}) {
  try {
    return api
      .get(
        `/blogs?page=${page}&categoryId=${data.categoryId || ""}&tagId=${data.tagId || ""}`,
        {}
      )
      .then((res) => res.data);
  } catch (error) {
    throw error;
  }
}

// get single blog
export async function getOneBlog(id) {
  try {
    return api.get(`/blogs/${id}`).then((res) => res.data.data);
  } catch (error) {
    throw error;
  }
}

// create blog
export async function createBlog(blog) {
  try {
    const response = await api.post("/blogs", blog, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// update blog
export async function updateBlog(id, blog) {
  try {
    return api
      .patch(`/blogs/${id}`, blog, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  } catch (error) {
    console.error("Caught error in mutationFn:", error);
    throw error;
  }
}

// delete blog
export async function deleteBlog(id) {
  try {
    return await api.delete(`/blogs/${id}`);
  } catch (error) {
    console.error("Caught error in mutationFn:", error);
    throw error;
  }
}
