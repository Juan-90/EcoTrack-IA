import { api } from "../api/api";

export const getBins = async () => {
  const response = await api.get("/bins");
  return response.data;
};