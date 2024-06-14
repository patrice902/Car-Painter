import { Formik } from "formik";
import React, { useMemo } from "react";
import { UserMin } from "src/types/model";
import { SharedSchemeWithUser } from "src/types/query";

import { InnerForm } from "./InnerForm";
import { SharingTabFormValues } from "./InnerForm/model";

type SharingTabProps = {
  editable: boolean;
  owner?: UserMin | null;
  schemeID: number;
  currentUser: UserMin;
  sharedUsers: SharedSchemeWithUser[];
  onCancel: () => void;
  onApply: (values: SharingTabFormValues) => void;
};

export const SharingTab = React.memo(
  ({
    editable,
    owner,
    schemeID,
    currentUser,
    sharedUsers,
    onCancel,
    onApply,
  }: SharingTabProps) => {
    const initialValues: SharingTabFormValues = useMemo(
      () => ({
        newUser: null,
        sharedUsers,
      }),
      [sharedUsers]
    );

    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={() => ({})}
        onSubmit={onApply}
      >
        {(formProps) => (
          <InnerForm
            {...formProps}
            editable={editable}
            owner={owner}
            currentUserID={currentUser.id}
            schemeID={schemeID}
            onCancel={onCancel}
          />
        )}
      </Formik>
    );
  }
);
