import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  ImageListItemBar,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import _ from "lodash";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useCallback, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithLoad, Loader, ScreenLoader } from "src/components/common";
import { ConfirmDialog, YesNoDialog } from "src/components/dialogs";
import {
  decodeHtml,
  getNameFromUploadFileName,
  uploadAssetURL,
} from "src/helper";
import { RootState } from "src/redux";
import {
  deleteItemsByUploadID as deleteLayerItemsByUploadID,
  setCurrent as setCurrentLayer,
} from "src/redux/reducers/layerReducer";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  createFavoriteUpload,
  deleteFavoriteUploadItem,
  deleteLegacyUploadsByUserID,
  deleteUpload,
  uploadFiles,
} from "src/redux/reducers/uploadReducer";
import SchemeService from "src/services/schemeService";
import { BuilderScheme, BuilderUpload } from "src/types/model";

import {
  CategoryText,
  CustomImageList,
  CustomImageListItem,
  DeleteButton,
  faStarOff,
  faStarOn,
} from "./UploadDialog.style";

type UploadListContentProps = {
  step?: number;
  uploads: BuilderUpload[];
  search: string;
  setSearch: (value: string) => void;
  onOpenUpload: (upload: BuilderUpload) => void;
};

export const UploadListContent = React.memo(
  ({
    step = 40,
    uploads,
    search,
    setSearch,
    onOpenUpload,
  }: UploadListContentProps) => {
    const dispatch = useDispatch();
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const user = useSelector((state: RootState) => state.authReducer.user);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const favoriteUploadList = useSelector(
      (state: RootState) => state.uploadReducer.favoriteUploadList
    );

    const [uploadToDelete, setUploadToDelete] = useState<BuilderUpload | null>(
      null
    );
    const [showLegacyDelete, setShowLegacyDelete] = useState(false);
    const [associatedSchemes, setAssociatedSchemes] = useState<BuilderScheme[]>(
      []
    );
    const [limit, setLimit] = useState(step);
    const [loading, setLoading] = useState(false);
    const [showLegacy, setShowLegacy] = useState(false);
    const [fetchingDeleteList, setFetchingDeleteList] = useState(false);
    const [dropZoneKey, setDropZoneKey] = useState(1);

    const scrollToRef = useRef(null);

    const favoriteUploadIDs = useMemo(
      () => favoriteUploadList.map((fav) => fav.upload_id),
      [favoriteUploadList]
    );

    const filteredUploads = useMemo(
      () =>
        _.orderBy(uploads, ["id"], "desc").filter(
          (item) =>
            getNameFromUploadFileName(item.file_name, user)
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (showLegacy || !item.legacy_mode)
        ),
      [uploads, user, search, showLegacy]
    );

    const favoriteFilteredUploads = useMemo(
      () =>
        filteredUploads.filter((logo) => favoriteUploadIDs.includes(logo.id)),
      [favoriteUploadIDs, filteredUploads]
    );

    const hasLegacyUploads = useMemo(
      () => uploads.some((item) => item.legacy_mode),
      [uploads]
    );

    const increaseData = useCallback(() => {
      setLimit(limit + step);
    }, [limit, step]);

    const handleClickAddFavorite = useCallback(
      (event, upload: BuilderUpload) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        if (!user) return;

        dispatch(
          createFavoriteUpload({ upload_id: upload.id, user_id: user.id })
        );
      },
      [dispatch, user]
    );

    const handleClickRemoveFavorite = useCallback(
      (event, upload: BuilderUpload) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        const favoriteUploadItem = favoriteUploadList.find(
          (item) => item.upload_id === upload.id
        );

        if (!favoriteUploadItem) return;

        dispatch(deleteFavoriteUploadItem(favoriteUploadItem.id));
      },
      [dispatch, favoriteUploadList]
    );

    const handleDropZoneChange = useCallback(
      (files_up: File[]) => {
        if (!user || !currentScheme) return;

        if (files_up.length) {
          setLoading(true);
          dispatch(
            uploadFiles(user.id, currentScheme.id, files_up, () => {
              setLoading(false);
            })
          );
          setSearch("");
          setDropZoneKey(dropZoneKey + 1);
        }
      },
      [dispatch, user, currentScheme, setSearch, dropZoneKey]
    );
    const handleClickDeleteUpload = useCallback(
      (event, uploadItem) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        setUploadToDelete(uploadItem);
      },
      [setUploadToDelete]
    );
    const handleDeleteUploadConfirm = useCallback(async () => {
      try {
        if (!uploadToDelete) return;

        setFetchingDeleteList(true);
        const schemes = await SchemeService.getSchemeListByUploadID(
          uploadToDelete.id
        );
        setFetchingDeleteList(false);
        if (schemes.length) {
          setAssociatedSchemes(schemes);
        } else {
          dispatch(deleteUpload(uploadToDelete, true));
          setUploadToDelete(null);
        }
      } catch (err) {
        dispatch(setMessage({ message: (err as Error).message }));
        setUploadToDelete(null);
      }
    }, [dispatch, uploadToDelete, setAssociatedSchemes, setUploadToDelete]);

    const handleDeleteAllLegacyConfirm = useCallback(async () => {
      setShowLegacyDelete(false);

      if (!user) return;

      dispatch(deleteLegacyUploadsByUserID(user.id, true));
    }, [dispatch, user]);

    const handleDeleteUploadFinally = useCallback(
      (deleteFromAll = true) => {
        if (!uploadToDelete) return;

        if (deleteFromAll) {
          dispatch(deleteLayerItemsByUploadID(uploadToDelete.id));
          dispatch(setCurrentLayer(null));
        }

        dispatch(deleteUpload(uploadToDelete, deleteFromAll));
        setUploadToDelete(null);
        setAssociatedSchemes([]);
      },
      [dispatch, uploadToDelete, setUploadToDelete, setAssociatedSchemes]
    );

    const handleCancelForDeleteUploadFinally = useCallback(
      () => handleDeleteUploadFinally(false),
      [handleDeleteUploadFinally]
    );

    const unsetUploadToDelete = useCallback(() => setUploadToDelete(null), []);

    const unsetShowLegacyDelete = useCallback(
      () => setShowLegacyDelete(false),
      []
    );

    const renderUploadList = (uploadList: BuilderUpload[]) => (
      <CustomImageList rowHeight={178} cols={isAboveMobile ? 3 : 2}>
        {uploadList.map((uploadItem) => {
          const isFavorite = favoriteUploadIDs.includes(uploadItem.id);

          return (
            <CustomImageListItem
              key={uploadItem.id}
              cols={1}
              onClick={() => onOpenUpload(uploadItem)}
            >
              <ImageWithLoad
                src={uploadAssetURL(uploadItem)}
                alt={getNameFromUploadFileName(uploadItem.file_name, user)}
                alignItems="center"
                height="100%"
                maxHeight="250px"
              />
              <ImageListItemBar
                title={getNameFromUploadFileName(uploadItem.file_name, user)}
                actionIcon={
                  <Box display="flex" alignItems="center">
                    <IconButton
                      color="secondary"
                      onClick={(event) =>
                        isFavorite
                          ? handleClickRemoveFavorite(event, uploadItem)
                          : handleClickAddFavorite(event, uploadItem)
                      }
                    >
                      <FontAwesomeIcon
                        icon={isFavorite ? faStarOn : faStarOff}
                        size="sm"
                      />
                    </IconButton>
                    <DeleteButton
                      onClick={(event) =>
                        handleClickDeleteUpload(event, uploadItem)
                      }
                    >
                      <DeleteIcon />
                    </DeleteButton>
                  </Box>
                }
              />
            </CustomImageListItem>
          );
        })}
      </CustomImageList>
    );

    return (
      <>
        {hasLegacyUploads ? (
          <Box
            display="flex"
            mb={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={showLegacy}
                  onChange={(e) => setShowLegacy(e.target.checked)}
                />
              }
              label="Show Legacy Uploads"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowLegacyDelete(true)}
            >
              Remove Legacy Uploads
            </Button>
          </Box>
        ) : (
          <></>
        )}
        <DropzoneArea
          onChange={handleDropZoneChange}
          showPreviews={false}
          showPreviewsInDropzone={false}
          showFileNamesInPreview={false}
          showFileNames={false}
          acceptedFiles={["image/*"]}
          filesLimit={10}
          key={dropZoneKey}
        />
        <Box
          id="upload-dialog-content"
          overflow="auto"
          height="min(700px, calc(100vh - 500px))"
          mt={1}
          position="relative"
        >
          <InfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < filteredUploads.length}
            loader={<Loader />}
            scrollableTarget="upload-dialog-content"
          >
            {favoriteFilteredUploads.length ? (
              <>
                <CategoryText color="secondary">Favorite</CategoryText>
                {renderUploadList(favoriteFilteredUploads)}
                <CategoryText color="secondary">All</CategoryText>
              </>
            ) : (
              <></>
            )}
            {renderUploadList(
              filteredUploads.slice(
                0,
                Math.max(limit - favoriteFilteredUploads.length, 4)
              )
            )}

            {loading ? (
              <Box
                position="absolute"
                bgcolor="rgba(0, 0, 0, 0.5)"
                width="100%"
                height="100%"
                left="0"
                top="0"
              >
                <ScreenLoader />
              </Box>
            ) : (
              <></>
            )}

            <div ref={scrollToRef} />
          </InfiniteScroll>
        </Box>

        <ConfirmDialog
          text={
            uploadToDelete
              ? `Are you sure you want to delete "${getNameFromUploadFileName(
                  uploadToDelete.file_name,
                  user
                )}"?`
              : ""
          }
          open={!!uploadToDelete}
          onCancel={unsetUploadToDelete}
          onConfirm={handleDeleteUploadConfirm}
          confirmLoading={fetchingDeleteList}
        />
        <ConfirmDialog
          text="Are you sure you want to delete all legacy uploads?"
          open={showLegacyDelete}
          onCancel={unsetShowLegacyDelete}
          onConfirm={handleDeleteAllLegacyConfirm}
        />
        <YesNoDialog
          text={
            associatedSchemes.length ? (
              <>
                This logo is being used on the following projects:
                <ul>
                  {associatedSchemes.map((item, index) => (
                    <li key={index}>{decodeHtml(item.name)}</li>
                  ))}
                </ul>
                Delete the logo from these projects?
              </>
            ) : (
              ""
            )
          }
          yesText="Delete"
          noText="Keep"
          open={!!associatedSchemes.length}
          onYes={() => handleDeleteUploadFinally(true)}
          onNo={handleCancelForDeleteUploadFinally}
        />
      </>
    );
  }
);

export default UploadListContent;
