import { Box, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import CryptoJS from "crypto-js";
import _ from "lodash";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useCallback, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Loader, ScreenLoader } from "src/components/common";
import { ConfirmDialog, YesNoDialog } from "src/components/dialogs";
import config from "src/config";
import { decodeHtml, getNameFromUploadFileName, getUserName } from "src/helper";
import { RootState } from "src/redux";
import {
  deleteItemsByUploadID as deleteLayerItemsByUploadID,
  setCurrent as setCurrentLayer,
} from "src/redux/reducers/layerReducer";
import { catchErrorMessage } from "src/redux/reducers/messageReducer";
import {
  deleteLegacyUploadsByUserID,
  deleteSharedUploadItem,
  deleteUpload,
  uploadFiles,
} from "src/redux/reducers/uploadReducer";
import SchemeService from "src/services/schemeService";
import { BuilderScheme, BuilderUploadWithUser } from "src/types/model";

import CopyCodeDialog from "./CopyCodeDialog";
import {
  CategoryText,
  CustomImageList,
  CustomImageListItem,
} from "./UploadDialog.style";
import { getUploadItemId, UploadItemContent } from "./UploadItemContent";

type UploadListContentProps = {
  step?: number;
  uploads: BuilderUploadWithUser[];
  search: string;
  setSearch: (value: string) => void;
  onOpenUpload: (upload: BuilderUploadWithUser) => void;
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

    const user = useSelector((state: RootState) => state.authReducer.user);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const favoriteUploadList = useSelector(
      (state: RootState) => state.uploadReducer.favoriteUploadList
    );
    const sharedUploadList = useSelector(
      (state: RootState) => state.uploadReducer.sharedUploadList
    );

    const [
      uploadToDelete,
      setUploadToDelete,
    ] = useState<BuilderUploadWithUser | null>(null);
    const [showLegacyDelete, setShowLegacyDelete] = useState(false);
    const [associatedSchemes, setAssociatedSchemes] = useState<BuilderScheme[]>(
      []
    );
    const [limit, setLimit] = useState(step);
    const [loading, setLoading] = useState(false);
    const [showLegacy, setShowLegacy] = useState(false);
    const [fetchingDeleteList, setFetchingDeleteList] = useState(false);
    const [dropZoneKey, setDropZoneKey] = useState(1);
    const [sharingCode, setSharingCode] = useState<string>();

    const scrollToRef = useRef(null);

    const favoriteUploadIDs = useMemo(
      () => favoriteUploadList.map((fav) => fav.upload_id),
      [favoriteUploadList]
    );

    const combinedUploads = useMemo(
      () => [...sharedUploadList.map((item) => item.upload), ...uploads],
      [sharedUploadList, uploads]
    );

    const ownAssociatedSchemes = useMemo(
      () => associatedSchemes.filter((item) => item.user_id === user?.id),
      [associatedSchemes, user]
    );

    const checkFileNameIncludesSearch = useCallback(
      (item: BuilderUploadWithUser, search: string) =>
        !search?.length ||
        getNameFromUploadFileName(item.file_name, item.user_id)
          .toLowerCase()
          .includes(search.toLowerCase()),
      []
    );

    const checkRelatedUserNameIncludesSearch = useCallback(
      (item: BuilderUploadWithUser, search: string) =>
        !search?.length ||
        (item.user_id !== user?.id &&
          getUserName(item.user).toLowerCase().includes(search.toLowerCase())),
      [user]
    );

    const filteredUploads = useMemo(
      () =>
        _.orderBy(combinedUploads, ["id"], "desc").filter(
          (item) =>
            (checkFileNameIncludesSearch(item, search) ||
              checkRelatedUserNameIncludesSearch(item, search)) &&
            (showLegacy || !item.legacy_mode)
        ),
      [
        combinedUploads,
        checkFileNameIncludesSearch,
        search,
        checkRelatedUserNameIncludesSearch,
        showLegacy,
      ]
    );

    const favoriteFilteredUploads = useMemo(
      () =>
        filteredUploads.filter((logo) => favoriteUploadIDs.includes(logo.id)),
      [favoriteUploadIDs, filteredUploads]
    );

    const hasLegacyUploads = useMemo(
      () => combinedUploads.some((item) => item.legacy_mode),
      [combinedUploads]
    );

    const increaseData = useCallback(() => {
      setLimit(limit + step);
    }, [limit, step]);

    const handleDropZoneChange = useCallback(
      (files_up: File[]) => {
        if (!user || !currentScheme) return;

        if (files_up.length) {
          setLoading(true);
          dispatch(
            uploadFiles(
              user.id,
              currentScheme.id,
              files_up,
              (newUploads?: BuilderUploadWithUser[]) => {
                setLoading(false);

                // Scroll into the new uploaded items
                if (newUploads?.length) {
                  document
                    .getElementById(getUploadItemId(newUploads[0]))
                    ?.scrollIntoView();
                }
              }
            )
          );
          setSearch("");
          setDropZoneKey(dropZoneKey + 1);
        }
      },
      [dispatch, user, currentScheme, setSearch, dropZoneKey]
    );

    const handleDeleteUploadConfirm = useCallback(async () => {
      try {
        if (!uploadToDelete) return;

        if (uploadToDelete.user_id !== user?.id) {
          // This is shared upload
          const foundShared = sharedUploadList.find(
            (item) => item.upload_id === uploadToDelete.id
          );

          if (foundShared) {
            dispatch(
              deleteSharedUploadItem(foundShared.id, () =>
                setUploadToDelete(null)
              )
            );
          }
          return;
        }

        setFetchingDeleteList(true);
        const schemes = await SchemeService.getSchemeListByUploadID(
          uploadToDelete.id
        );
        const validSchemes = schemes.filter(
          (item) => item.user_id === user?.id
        );
        setFetchingDeleteList(false);
        if (validSchemes.length) {
          setAssociatedSchemes(schemes);
        } else {
          dispatch(deleteUpload(uploadToDelete, false));
          setUploadToDelete(null);
        }
      } catch (err) {
        dispatch(catchErrorMessage(err));
        setUploadToDelete(null);
      }
    }, [uploadToDelete, user?.id, sharedUploadList, dispatch]);

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

        dispatch(
          deleteUpload(
            uploadToDelete,
            deleteFromAll,
            associatedSchemes.length !== ownAssociatedSchemes.length
              ? user?.id
              : undefined
          )
        );
        setUploadToDelete(null);
        setAssociatedSchemes([]);
      },
      [
        uploadToDelete,
        dispatch,
        associatedSchemes.length,
        ownAssociatedSchemes.length,
        user,
      ]
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

    const handleOpenShareCode = useCallback((id: number) => {
      const hash = CryptoJS.Rabbit.encrypt(
        id.toString(),
        config.cryptoKey
      ).toString();
      setSharingCode(hash);
    }, []);

    const renderUploadList = (uploadList: BuilderUploadWithUser[]) => (
      <CustomImageList rowHeight={178} cols={2}>
        {uploadList.map((uploadItem) => (
          <CustomImageListItem
            key={uploadItem.id}
            onClick={() => onOpenUpload(uploadItem)}
          >
            <UploadItemContent
              uploadItem={uploadItem}
              onShareCode={handleOpenShareCode}
              onDelete={setUploadToDelete}
            />
          </CustomImageListItem>
        ))}
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
          filesLimit={3}
          key={dropZoneKey}
        />
        <Box
          id="upload-dialog-content"
          overflow="auto"
          height="min(700px, calc(100vh - 500px))"
          minHeight="300px"
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
                  uploadToDelete.user_id
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
            ownAssociatedSchemes.length ? (
              <>
                This logo is being used on the following projects:
                <ul>
                  {ownAssociatedSchemes.map((item, index) => (
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
          open={!!ownAssociatedSchemes.length}
          onYes={() => handleDeleteUploadFinally(true)}
          onNo={handleCancelForDeleteUploadFinally}
        />
        <CopyCodeDialog
          open={Boolean(sharingCode)}
          code={sharingCode}
          onCancel={() => setSharingCode(undefined)}
        />
      </>
    );
  }
);

export default UploadListContent;
