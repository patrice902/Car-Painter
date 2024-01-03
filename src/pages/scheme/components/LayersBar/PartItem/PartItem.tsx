import { Box } from "@material-ui/core";
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useRef } from "react";
import { decodeHtml, focusBoardQuickly, stopPropagation } from "src/helper";
import { BuilderLayerJSON } from "src/types/query";

import { CustomTypography, SmallIconButton, Wrapper } from "./PartItem.style";

type PartItemProps = {
  item: BuilderLayerJSON;
  layer_visible: number | boolean;
  layer_locked: number | boolean;
  text: string;
  selected: boolean;
  disabled: boolean;
  disableLock: boolean;
  onSelect: (item: BuilderLayerJSON) => void;
  onDoubleClick?: () => void;
  hovered: boolean;
  onHover: (item: BuilderLayerJSON, hovered: boolean) => void;
  toggleField: (id: string | number, field: string) => void;
};

export const PartItem = React.memo(
  ({
    item,
    layer_visible,
    layer_locked,
    text,
    selected,
    disabled,
    disableLock,
    onSelect,
    onDoubleClick,
    hovered,
    onHover,
    toggleField,
  }: PartItemProps) => {
    const wrapperRef = useRef(null);

    const handleToggleVisible = useCallback(
      (e) => {
        stopPropagation(e);
        toggleField(item.id, "layer_visible");
        focusBoardQuickly();
      },
      [item.id, toggleField]
    );

    const handleToggleLock = useCallback(
      (e) => {
        stopPropagation(e);
        toggleField(item.id, "layer_locked");
        focusBoardQuickly();
      },
      [item.id, toggleField]
    );

    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        stopPropagation(e);
        onSelect(item);
        focusBoardQuickly();
      },
      [item, onSelect]
    );

    return (
      <Wrapper
        ref={wrapperRef}
        px={2}
        py={0.5}
        display="flex"
        width="100%"
        borderBottom="1px solid gray"
        onClick={handleClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => onHover(item, true)}
        onMouseLeave={() => onHover(item, false)}
        className={clsx(selected && "activeItem", hovered && "hoveredItem")}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          height="24px"
        >
          <CustomTypography
            variant="body2"
            active={layer_visible ? "true" : "false"}
            noWrap
          >
            {decodeHtml(text)}
          </CustomTypography>
          {selected || hovered || layer_locked || !layer_visible ? (
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {!disableLock &&
              !disabled &&
              (selected || hovered || layer_locked) ? (
                <Box mr={1}>
                  <SmallIconButton onClick={handleToggleLock} size="small">
                    {layer_locked ? <LockIcon /> : <LockOpenIcon />}
                  </SmallIconButton>
                </Box>
              ) : (
                <></>
              )}
              {!disabled && (selected || hovered || !layer_visible) ? (
                <SmallIconButton onClick={handleToggleVisible} size="small">
                  {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </SmallIconButton>
              ) : (
                <Box width="24px" height="24px" />
              )}
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Wrapper>
    );
  }
);

export default PartItem;
