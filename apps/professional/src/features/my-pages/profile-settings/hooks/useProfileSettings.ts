import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getProfileSettings,
  updateProfileSettings,
} from "../api/profileSettings.api"

export const useProfileSettings = () =>
  useQuery({
    queryKey: ["profile-settings"],
    queryFn: getProfileSettings,
  })

export const useUpdateProfileSettings = () =>
  useMutation({
    mutationFn: updateProfileSettings,
  })