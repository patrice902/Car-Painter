import { Box, Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router";
import { ProjectItem, ScreenLoader } from "src/components/common";
import { decodeHtml, parseScheme, scrollBackOnProjectList } from "src/helper";
import { CarMake } from "src/types/model";
import {
  BuilderSchemeJSONForGetListByUserId,
  FavoriteSchemeForGetListByUserId,
  UserWithoutPassword,
} from "src/types/query";

type FavoriteProjectsProps = {
  user: UserWithoutPassword;
  favoriteSchemeList: FavoriteSchemeForGetListByUserId[];
  sortBy: number;
  search: string;
  selectedVehicle?: CarMake | null;
  hideLegacy: boolean;
  onDeleteProject: (schemeID: number) => void;
  onCloneProject: (schemeID: number) => void;
  onRemoveFavorite: (favoriteID: number, callback?: () => void) => void;
  onAddFavorite: (
    userID: number,
    schemeID: number,
    callback?: () => void
  ) => void;
};

export const FavoriteProjects = React.memo(
  ({
    user,
    favoriteSchemeList,
    sortBy,
    search,
    selectedVehicle,
    hideLegacy,
    onCloneProject,
    onDeleteProject,
    onRemoveFavorite,
    onAddFavorite,
  }: FavoriteProjectsProps) => {
    const history = useHistory();
    const step = 15;
    const [limit, setLimit] = useState(step);

    const filteredSchemeList = useMemo(
      () =>
        _.orderBy(
          favoriteSchemeList.filter(
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
              !item.scheme.carMake.deleted
          ),
          sortBy === 1
            ? ["scheme.name"]
            : sortBy === 2
            ? ["scheme.carMake.name"]
            : ["scheme.date_modified"],
          sortBy === 1 ? ["asc"] : sortBy === 2 ? ["asc"] : ["desc"]
        ),
      [favoriteSchemeList, search, selectedVehicle, sortBy, hideLegacy]
    );

    const openScheme = (schemeID: number) => {
      history.push(`/project/${schemeID}`);
    };

    const increaseData = () => {
      setLimit(limit + step);
    };

    useEffect(() => {
      setTimeout(scrollBackOnProjectList, 500);
    }, []);

    return (
      <>
        {filteredSchemeList.length ? (
          <InfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < filteredSchemeList.length}
            loader={<ScreenLoader />}
            scrollableTarget="scheme-list-content"
          >
            <Grid container spacing={4}>
              {filteredSchemeList.slice(0, limit).map((favorite) => {
                const isOwner = favorite.scheme.user_id === user.id;
                const isPublic = favorite.scheme.public;

                return (
                  <Grid
                    key={favorite.id}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                  >
                    <ProjectItem
                      user={user}
                      scheme={
                        parseScheme(
                          favorite.scheme
                        ) as BuilderSchemeJSONForGetListByUserId
                      }
                      isFavorite
                      markAsPublic
                      favoriteID={favorite.id}
                      onRemoveFavorite={onRemoveFavorite}
                      onAddFavorite={onAddFavorite}
                      onOpenScheme={openScheme}
                      onCloneProject={
                        isOwner || isPublic ? onCloneProject : undefined
                      }
                      onDelete={isOwner ? onDeleteProject : undefined}
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

export default FavoriteProjects;
