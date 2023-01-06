import { useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { ImageWithLoad, NoRowsOverlay } from "components/common";
import config from "config";
import { useCallback } from "react";
import { BigTooltip } from "./OverlaysPanel.style";
import { getOverlayList } from "redux/reducers/overlayReducer";

const OverlaysPanel = () => {
  const dispatch = useDispatch();
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const loading = useSelector((state) => state.overlayReducer.loading);

  const handleEditClick = useCallback((id) => {
    console.log("Editing: ", id);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    console.log("Deleting: ", id);
  }, []);

  const handleAddClick = useCallback((id) => {
    console.log("Adding: ");
  }, []);

  const Toolbar = () => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        py={2}
        pr={2}
        borderBottom="1px solid rgb(81, 81, 81)"
      >
        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </GridToolbarContainer>
        <Button startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Graphic
        </Button>
      </Box>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params) => (
        <BigTooltip title={params.value}>
          <Typography style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
            {params.value}
          </Typography>
        </BigTooltip>
      ),
    },
    {
      field: "overlay_file",
      headerName: "Origin",
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ImageWithLoad
          src={`${config.assetsURL}/${params.value}`}
          alt={params.getValue(params.id, "name")}
          alignItems="center"
          height={100}
        />
      ),
    },
    {
      field: "overlay_thumb",
      headerName: "Thumbnail",
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ImageWithLoad
          src={`${config.assetsURL}/${params.value}`}
          alt={params.getValue(params.id, "name")}
          alignItems="center"
          height={100}
        />
      ),
    },
    {
      field: "color",
      headerName: "Color",
      width: 120,
    },
    {
      field: "stroke_scale",
      headerName: "Stroke Scale",
      type: "number",
      width: 150,
    },
    {
      field: "legacy_mode",
      headerName: "Legacy",
      type: "boolean",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableReorder: true,
      width: 100,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <IconButton
            aria-label="edit"
            onClick={() => handleEditClick(params.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteClick(params.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    if (!overlayList.length) dispatch(getOverlayList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width="100%" height="calc(100vh - 156px)">
      <DataGrid
        rows={overlayList}
        columns={columns}
        loading={loading}
        rowHeight={100}
        disableSelectionOnClick
        components={{
          Toolbar,
          NoRowsOverlay,
        }}
      />
    </Box>
  );
};

export default OverlaysPanel;
