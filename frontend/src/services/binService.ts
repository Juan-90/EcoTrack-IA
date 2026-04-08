import { api } from "@/src/services/api";


export const getBins = async () => {
  const response = await api.get("/bins");
  return response.data;
};