import { Box, Button, IconButton, Typography } from "@material-ui/core";
import {
  DataGrid,
  GridColumns,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithLoad, NoRowsOverlay } from "src/components/common";
import { ConfirmDialog } from "src/components/dialogs";
import config from "src/config";
import { RootState } from "src/redux";
import { deleteLogo, getLogoList } from "src/redux/reducers/logoReducer";
import { BuilderLogo } from "src/types/model";

import { AddLogoDialog } from "./AddLogoDialog";
import { BigTooltip } from "./LogosPanel.style";
import { UpdateLogoDialog } from "./UpdateLogoDialog";

const LogosPanel = () => {
  const dispatch = useDispatch();
  const logoList = useSelector((state: RootState) => state.logoReducer.list);
  const loading = useSelector((state: RootState) => state.logoReducer.loading);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [logoIDToDelete, setLogoIDToDelete] = useState<number | null>();
  const [logoToEdit, setLogoToEdit] = useState<BuilderLogo>();

  const handleEditClick = useCallback(
    (id) => {
      setLogoToEdit(logoList.find((item) => item.id === id));
    },
    [logoList]
  );

  const handleShowDeleteConfirmation = useCallback((id?: number) => {
    setLogoIDToDelete(id);
  }, []);

  const handleDeleteClick = useCallback(() => {
    if (logoIDToDelete) {
      dispatch(deleteLogo(logoIDToDelete));
      handleShowDeleteConfirmation();
    }
  }, [dispatch, logoIDToDelete, handleShowDeleteConfirmation]);

  const handleAddClick = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const hideDeleteConfirmation = useCallback(() => setLogoIDToDelete(null), []);

  const Toolbar = () => (
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
      <AddLogoDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );

  const columns: GridColumns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params) => (
        <BigTooltip title={params.value as string}>
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
          alt={params.getValue(params.id, "name") as string}
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
          alt={params.getValue(params.id, "name") as string}
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
        <Box display="flex" style={{ gap: "8px" }}>
          <IconButton
            aria-label="edit"
            onClick={() => handleEditClick(params.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleShowDeleteConfirmation(params.id as number)}
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
      {logoToEdit ? (
        <UpdateLogoDialog
          open
          data={logoToEdit}
          onClose={() => setLogoToEdit(undefined)}
        />
      ) : (
        <></>
      )}
      <ConfirmDialog
        text={`Are you sure you want to delete this logo?`}
        open={!!logoIDToDelete}
        onCancel={hideDeleteConfirmation}
        onConfirm={handleDeleteClick}
      />
    </Box>
  );
};

export default LogosPanel;
