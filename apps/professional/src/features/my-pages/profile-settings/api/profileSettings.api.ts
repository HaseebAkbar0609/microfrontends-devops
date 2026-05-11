import axiosInstance from "@/lib/axiosInstance"

export const getProfileSettings = async () => {
  const res = await axiosInstance.get("/profile/settings")
  return res.data
}

export const updateProfileSettings = async (data: unknown) => {
  const res = await axiosInstance.put("/profile/settings", data)
  return res.data
}
