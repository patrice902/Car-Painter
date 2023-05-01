import { SharedSchemeWithUser, UserWithoutPassword } from "src/types/query";

export type SharingTabFormValues = {
  newUser: {
    user_id: number;
    user: UserWithoutPassword;
    pro_user: boolean;
    scheme_id: number;
    accepted: boolean;
    editable: boolean;
  } | null;
  sharedUsers: SharedSchemeWithUser[];
};
