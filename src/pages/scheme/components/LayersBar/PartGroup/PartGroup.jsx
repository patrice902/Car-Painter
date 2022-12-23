import React, { useState, useMemo, useCallback } from "react";

import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { ReactSortable } from "react-sortablejs";

import { MouseModes, LayerTypes } from "constant";
import {
  updateLayer,
  setCurrent as setCurrentLayer,
  bulkUpdateLayer,
} from "redux/reducers/layerReducer";
import { setMouseMode } from "redux/reducers/boardReducer";

import { Box, Card, Collapse } from "@material-ui/core";
import { LightTooltip } from "components/common";
import { HeaderTitle, CustomCardContent } from "./PartGroup.style";

import { PartItem } from "../PartItem";
import { PartAction } from "../PartAction";
import { focusBoardQuickly } from "helper";

export const PartGroup = (props) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const user = useSelector((state) => state.authReducer.user);
  const {
    layerList,
    title,
    disabled,
    actions,
    extraChildren,
    disableLock,
    disableDnd,
    hoveredLayerJSON,
    onChangeHoverJSONItem,
    onDoubleClickItem,
  } = props;

  const sortedList = useMemo(
    () => _.orderBy(layerList, ["layer_order"], ["asc"]),
    [layerList]
  );

  // useEffect(() => {
  //   for (let index in sortedList) {
  //     if (sortedList[index].layer_order !== parseInt(index) + 1) {
  //       console.log("updateLayer in PartGroup!");
  //       dispatch(
  //         updateLayer(
  //           {
  //             ...sortedList[index],
  //             layer_order: parseInt(index) + 1,
  //           },
  //           false
  //         )
  //       );
  //     }
  //   }
  // }, [dispatch, layerList.length, sortedList]);

  const handleExpandClick = useCallback(() => {
    setExpanded((preValue) => !preValue);
    focusBoardQuickly();
  }, [setExpanded]);
  const handleChangeLayerOrders = useCallback(
    (list) => {
      const layers = [];
      for (let index in list) {
        const layer = layerList.find(
          (item) => item.id.toString() === list[index].id.toString()
        );
        if (layer && layer.layer_order !== parseInt(index) + 1) {
          layers.push({
            id: layer.id,
            layer_order: parseInt(index) + 1,
          });
        }
      }
      if (layers.length) {
        dispatch(bulkUpdateLayer(layers));
      }
    },
    [layerList, dispatch]
  );
  const toggleField = useCallback(
    (id, field) => {
      const layer = layerList.find((item) => item.id === id);
      dispatch(
        updateLayer({
          id: layer.id,
          [field]: layer[field] ? 0 : 1,
        })
      );
    },
    [layerList, dispatch]
  );
  const selectLayer = useCallback(
    (layer) => {
      dispatch(setCurrentLayer(layer));
      dispatch(setMouseMode(MouseModes.DEFAULT));
    },
    [dispatch]
  );
  const hoverLayer = useCallback(
    (layer, flag) => {
      onChangeHoverJSONItem(layer.id, flag);
    },
    [onChangeHoverJSONItem]
  );
  const layerName = useCallback(
    (name, type) => {
      if (type === LayerTypes.UPLOAD && name.indexOf(user.id.toString()) === 0)
        return name.slice(user.id.toString().length + 1);
      return name;
    },
    [user]
  );

  return (
    <Box mb={2}>
      <Card>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          padding="16px 16px 16px 45px"
          height="52px"
        >
          <LightTooltip title={title} arrow>
            <HeaderTitle>{title}</HeaderTitle>
          </LightTooltip>
          <PartAction
            expanded={expanded}
            actions={!disabled ? actions : undefined}
            onExpandClick={handleExpandClick}
          />
        </Box>
        <Collapse in={expanded}>
          <CustomCardContent>
            <ReactSortable
              list={sortedList}
              setList={handleChangeLayerOrders}
              animation={150}
              sort={!disableDnd && !disabled}
            >
              {sortedList.map((item) => (
                <PartItem
                  text={layerName(item.layer_data.name, item.layer_type)}
                  layer_visible={item.layer_visible}
                  layer_locked={item.layer_locked}
                  key={item.id}
                  item={item}
                  toggleField={toggleField}
                  selected={currentLayer && currentLayer.id === item.id}
                  hovered={hoveredLayerJSON[item.id]}
                  onSelect={selectLayer}
                  onDoubleClick={onDoubleClickItem}
                  onHover={hoverLayer}
                  disableLock={disableLock}
                  disabled={disabled}
                />
              ))}
            </ReactSortable>
            {extraChildren}
          </CustomCardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default PartGroup;
