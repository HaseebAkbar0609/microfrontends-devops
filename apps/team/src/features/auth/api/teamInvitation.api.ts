import axios from "axios";
import { API_PATH } from "@/constants/api";
import type { TeamInvitationValues } from "../schemas/teamInvitation.schema";

// Invitation links are public bearer credentials, independent of any signed-in admin session.
const invitationClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") });
export interface TeamInvitationInfo { company_name: string; requires_password: boolean }

export async function validateTeamInvitation(token: string): Promise<TeamInvitationInfo> {
  const response = await invitationClient.post<{ data: TeamInvitationInfo }>(API_PATH.AUTH.VALIDATE_INVITATION, { token });
  return response.data.data;
}

export function invitationAcceptPayload(token: string, requiresPassword: boolean, values: TeamInvitationValues) {
  return requiresPassword ? { token, password: values.password, confirm_password: values.confirmPassword } : { token };
}

export async function acceptTeamInvitation(token: string, requiresPassword: boolean, values: TeamInvitationValues) {
  await invitationClient.post(API_PATH.AUTH.ACCEPT_INVITATION, invitationAcceptPayload(token, requiresPassword, values));
}
