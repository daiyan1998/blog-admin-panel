import api from "./axiosInstance";

export async function getMembers() {
  return api.get("/members").then((res) => res.data.data);
}

export async function createMember(data) {
  return api
    .post("/members", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}

export async function updateMember(data) {
  console.log(data, "data fetch member");
  return api
    .patch(`/members/${data.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.data);
}

export async function deleteMember(id) {
  return api.delete(`/members/${id}`).then((res) => res.data.data);
}
