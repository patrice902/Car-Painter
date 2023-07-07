import { Box, Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router";
import { ProjectItem, ScreenLoader } from "src/components/common";
import { decodeHtml, parseScheme, scrollBackOnProjectList } from "src/helper";
import { CarMake } from "src/types/model";
import {
  BuilderSchemeJSONForGetListByUserId,
  FavoriteSchemeForGetListByUserId,
  SharedSchemeForGetListByUserId,
  UserWithoutPassword,
} from "src/types/query";

type SharedProjectsProps = {
  user: UserWithoutPassword;
  blockedBy: number[];
  sharedSchemeList: SharedSchemeForGetListByUserId[];
  favoriteSchemeList: FavoriteSchemeForGetListByUserId[];
  sortBy: number;
  search: string;
  selectedVehicle?: CarMake | null;
  hideLegacy: boolean;
  onAccept: (sharedID: number, callback?: () => void) => void;
  onRemove: (sharedID: number, callback?: () => void) => void;
  onRemoveFavorite: (favoriteID: number, callback?: () => void) => void;
  onAddFavorite: (
    userID: number,
    schemeID: number,
    callback?: () => void
  ) => void;
};

export const SharedProjects = React.memo(
  ({
    user,
    blockedBy,
    sharedSchemeList,
    favoriteSchemeList,
    sortBy,
    search,
    selectedVehicle,
    hideLegacy,
    onAccept,
    onRemove,
    onRemoveFavorite,
    onAddFavorite,
  }: SharedProjectsProps) => {
    const step = 15;
    const history = useHistory();
    const [limit, setLimit] = useState(step);

    const filteredSharedSchemeList = useMemo(
      () =>
        _.orderBy(
          sharedSchemeList.filter(
            (item) =>
              (decodeHtml(item.scheme.name)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                decodeHtml(item.scheme.carMake.name)
                  .toLowerCase()
                  .includes(search.toLowerCase())) &&
              (!selectedVehicle ||
                selectedVehicle.id === item.scheme.carMake.id) &&
              (!hideLegacy || !item.scheme.legacy_mode) &&
              !item.scheme.carMake.deleted &&
              !blockedBy.includes(item.scheme.user_id)
          ),
          sortBy === 1
            ? ["scheme.name"]
            : sortBy === 2
            ? ["scheme.carMake.name"]
            : ["scheme.date_modified"],
          sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
        ),
      [sharedSchemeList, sortBy, search, selectedVehicle, hideLegacy, blockedBy]
    );

    const pendingSharedSchemeList = useMemo(
      () => filteredSharedSchemeList.filter((item) => !item.accepted),
      [filteredSharedSchemeList]
    );

    const acceptedSharedSchemeList = useMemo(
      () => filteredSharedSchemeList.filter((item) => item.accepted),
      [filteredSharedSchemeList]
    );

    const openScheme = useCallback(
      (schemeID, sharedID) => {
        if (sharedID) {
          const sharedScheme = filteredSharedSchemeList.find(
            (item) => item.id === sharedID
          );
          if (sharedScheme?.accepted) {
            history.push(`/project/${schemeID}`);
          } else {
            onAccept(sharedID, () => history.push(`/project/${schemeID}`));
          }
        } else {
          history.push(`/project/${schemeID}`);
        }
      },
      [filteredSharedSchemeList, history, onAccept]
    );

    const increaseData = () => {
      setLimit(limit + step);
    };

    useEffect(() => {
      setTimeout(scrollBackOnProjectList, 500);
    }, []);

    return (
      <>
        {filteredSharedSchemeList.length ? (
          <InfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < acceptedSharedSchemeList.length}
            loader={<ScreenLoader />}
            scrollableTarget="scheme-list-content"
          >
            {pendingSharedSchemeList.length ? (
              <>
                <Typography variant="h4" style={{ marginBottom: "8px" }}>
                  New invitations
                </Typography>

                <Grid container spacing={4}>
                  {pendingSharedSchemeList.map((sharedScheme) => {
                    const favroiteScheme = favoriteSchemeList.find(
                      (item) => item.scheme_id === sharedScheme.scheme_id
                    );
                    return (
                      <Grid
                        key={sharedScheme.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={3}
                      >
                        <ProjectItem
                          user={user}
                          isFavorite={!!favroiteScheme}
                          scheme={
                            parseScheme(
                              sharedScheme.scheme
                            ) as BuilderSchemeJSONForGetListByUserId
                          }
                          shared={true}
                          accepted={false}
                          sharedID={sharedScheme.id}
                          favoriteID={favroiteScheme?.id}
                          onAccept={onAccept}
                          onOpenScheme={openScheme}
                          onDelete={onRemove}
                          onRemoveFavorite={onRemoveFavorite}
                          onAddFavorite={onAddFavorite}
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                <Box my={5} bgcolor="#808080" width="100%" height="1px" />
              </>
            ) : (
              <></>
            )}

            <Grid container spacing={4}>
              {acceptedSharedSchemeList.slice(0, limit).map((sharedScheme) => {
                const favroiteScheme = favoriteSchemeList.find(
                  (item) => item.scheme_id === sharedScheme.scheme_id
                );
                return (
                  <Grid
                    key={sharedScheme.id}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                  >
                    <ProjectItem
                      user={user}
                      isFavorite={!!favroiteScheme}
                      scheme={
                        parseScheme(
                          sharedScheme.scheme
                        ) as BuilderSchemeJSONForGetListByUserId
                      }
                      shared={true}
                      accepted={true}
                      sharedID={sharedScheme.id}
                      favoriteID={favroiteScheme?.id}
                      onOpenScheme={openScheme}
                      onDelete={onRemove}
                      onRemoveFavorite={onRemoveFavorite}
                      onAddFavorite={onAddFavorite}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </InfiniteScroll>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="min(500px, 50vh)"
            flexGrow={1}
          >
            <Typography variant="h2">No Projects</Typography>
          </Box>
        )}
      </>
    );
  }
);

export default SharedProjects;
