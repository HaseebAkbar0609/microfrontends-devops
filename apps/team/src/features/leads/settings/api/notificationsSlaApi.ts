import axiosInstance from "@/lib/axiosInstance";

export type NotificationsSlaApiData = {
  send_reminder?: boolean;
  reminder_after_hours?: number;
  notify_owner?: boolean;
  escalate?: boolean;
  escalate_after_hours?: number;
  escalation_email?: string;
};

export const fetchNotificationsSla = async (): Promise<NotificationsSlaApiData> => {
  const { data } = await axiosInstance.get<{ data: NotificationsSlaApiData }>("/api/v1/teams/leads/notifications-sla");
  return data.data || {};
};

export const updateNotificationsSla = async (payload: Partial<NotificationsSlaApiData>): Promise<NotificationsSlaApiData> => {
  const { data } = await axiosInstance.patch<{ data: NotificationsSlaApiData }>("/api/v1/teams/leads/notifications-sla", payload);
  return data.data;
};
