import { Formik } from "formik";
import React, { useMemo } from "react";

import { InnerForm } from "./InnerForm";

export const SharingTab = React.memo((props) => {
  const {
    editable,
    owner,
    schemeID,
    currentUser,
    sharedUsers,
    onCancel,
    onApply,
  } = props;

  const initialValues = useMemo(
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
      // validationSchema={Yup.object().shape({
      //   user_id: Yup.number().min(0),
      // })}
      validate={() => {
        return {};
      }}
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
});
