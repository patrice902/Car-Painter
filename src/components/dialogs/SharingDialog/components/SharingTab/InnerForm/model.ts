import { UserMin } from "src/types/model";
import { SharedSchemeWithUser } from "src/types/query";

export type SharingTabFormValues = {
  newUser: {
    user_id: number;
    user: UserMin;
    pro_user: boolean;
    scheme_id: number;
    accepted: boolean;
    editable: boolean;
  } | null;
  sharedUsers: SharedSchemeWithUser[];
};
