export type InvitedUser = Array<{
  email: string;
  roleId: string;
}>;

export interface InviteUserPayload {
  invitedUsers: InvitedUser;
  language?: string;
}
