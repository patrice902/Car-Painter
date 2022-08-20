import { FinishOptions } from "constant";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useScheme = () => {
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const legacyMode = useMemo(() => currentScheme && currentScheme.legacy_mode, [
    currentScheme,
  ]);
  const guideData = useMemo(() => currentScheme && currentScheme.guide_data, [
    currentScheme,
  ]);

  const schemeFinishBase = useMemo(() => {
    if (currentScheme) {
      const foundFinish = FinishOptions.find(
        (item) => item.value === currentScheme.finish
      );
      if (foundFinish) return foundFinish.base;
    }

    return FinishOptions[0].base;
  }, [currentScheme]);

  return { currentScheme, legacyMode, guideData, schemeFinishBase };
};
