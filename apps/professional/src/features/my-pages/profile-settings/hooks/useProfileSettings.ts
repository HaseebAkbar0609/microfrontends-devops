import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  changePassword,
  getProfileSettings,
  updateProfileSettings,
  type ProfileSettingsData,
} from "../api/profileSettings.api"

export type { ProfileSettingsData }

export const useProfileSettings = () =>
  useQuery({
    queryKey: ["profile-settings"],
    queryFn: getProfileSettings,
  })

export const useUpdateProfileSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile-settings"] }),
  })
}

export const useChangePassword = () =>
  useMutation({ mutationFn: changePassword })