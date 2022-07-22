import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { GuidesSetting } from "./components";

import { updateScheme } from "redux/reducers/schemeReducer";
import { setPaintingGuides } from "redux/reducers/boardReducer";

export const SchemeProperty = React.memo((props) => {
  const { editable } = props;

  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  const handleApplyGuideSettings = useDebouncedCallback((guide_data) => {
    dispatch(
      updateScheme({
        ...currentScheme,
        guide_data: {
          ...currentScheme.guide_data,
          ...guide_data,
        },
      })
    );
  }, 300);
  const handleChangePaintingGuides = useDebouncedCallback((newFormats) => {
    dispatch(setPaintingGuides(newFormats));
  }, 300);

  return (
    <>
      <GuidesSetting
        editable={editable}
        guide_data={currentScheme.guide_data}
        paintingGuides={paintingGuides}
        onApply={handleApplyGuideSettings}
        onChangePaintingGuides={handleChangePaintingGuides}
      />
    </>
  );
});

export default SchemeProperty;
