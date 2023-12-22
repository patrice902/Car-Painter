import { Group } from "konva/types/Group";
import { Stage } from "konva/types/Stage";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { WithKeyEventProps } from "src/hooks/withKeyEvent";
import { RootState } from "src/redux";

export const withWrapper = (Component: React.FC<WithKeyEventProps>) => () => {
  const stageRef = useRef<Stage>(null);
  const baseLayerRef = useRef<Group>(null);
  const mainLayerRef = useRef<Group>(null);
  const carMakeLayerRef = useRef<Group>(null);
  const carMaskLayerRef = useRef<Group>(null);

  const user = useSelector((state: RootState) => state.authReducer.user);
  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );
  const sharedUsers = useSelector(
    (state: RootState) => state.schemeReducer.sharedUsers
  );

  const editable = useMemo(
    () =>
      !user || !currentScheme
        ? false
        : user.id === currentScheme.user_id ||
          sharedUsers.find(
            (shared) => shared.user_id === user.id && shared.editable
          ),
    [user, currentScheme, sharedUsers]
  );

  return (
    <Component
      editable={!!editable}
      stageRef={stageRef}
      baseLayerRef={baseLayerRef}
      mainLayerRef={mainLayerRef}
      carMakeLayerRef={carMakeLayerRef}
      carMaskLayerRef={carMaskLayerRef}
    />
  );
};
