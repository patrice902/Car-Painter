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
import { getLogoList } from "redux/reducers/logoReducer";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { ImageWithLoad, NoRowsOverlay } from "components/common";
import config from "config";
import { useCallback } from "react";
import { BigTooltip } from "./LogosPanel.style";

const LogosPanel = () => {
  const dispatch = useDispatch();
  const logoList = useSelector((state) => state.logoReducer.list);
  const loading = useSelector((state) => state.logoReducer.loading);

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
          Add Logo
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
      field: "source_file",
      headerName: "Source",
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
      field: "preview_file",
      headerName: "Preview",
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
      field: "active",
      headerName: "Active",
      type: "boolean",
      width: 120,
    },
    {
      field: "enable_color",
      headerName: "Enable Color",
      type: "boolean",
      width: 150,
    },
    {
      field: "type",
      headerName: "Type",
      type: "singleSelect",
      width: 100,
      valueOptions: ["flag", ""],
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
    if (!logoList.length) dispatch(getLogoList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width="100%" height="calc(100vh - 156px)">
      <DataGrid
        rows={logoList}
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

export default LogosPanel;
