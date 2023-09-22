import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  ImageListItemBar,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithLoad, Loader } from "src/components/common";
import config from "src/config";
import { stopPropagation } from "src/helper";
import { RootState } from "src/redux";
import {
  createFavoriteLogo,
  deleteFavoriteLogoItem,
} from "src/redux/reducers/logoReducer";
import { BuilderLogo } from "src/types/model";

import {
  CategoryText,
  CustomImageList,
  CustomImageListItem,
  faStarOff,
  faStarOn,
} from "./common.style";

type LogoContentProps = {
  step: number;
  logos: BuilderLogo[];
  search: string;
  onOpen: (logo: BuilderLogo) => void;
};

export const LogoContent = React.memo(
  ({ step, logos, search, onOpen }: LogoContentProps) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.authReducer.user);
    const favoriteLogoList = useSelector(
      (state: RootState) => state.logoReducer.favoriteLogoList
    );

    const [logoLimit, setLogoLimit] = useState(step);
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const favoriteLogoIDs = useMemo(
      () => favoriteLogoList.map((logo) => logo.logo_id),
      [favoriteLogoList]
    );
    const filteredLogos = useMemo(
      () =>
        logos.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            item.type !== "flag" &&
            item.active
        ),
      [logos, search]
    );

    const favoriteFilteredLogos = useMemo(
      () => filteredLogos.filter((logo) => favoriteLogoIDs.includes(logo.id)),
      [favoriteLogoIDs, filteredLogos]
    );

    const increaseLogoData = useCallback(() => {
      setLogoLimit(logoLimit + step);
    }, [logoLimit, step, setLogoLimit]);

    const handleClickAddFavorite = useCallback(
      (event, logo: BuilderLogo) => {
        stopPropagation(event);

        if (!user) return;

        dispatch(createFavoriteLogo({ logo_id: logo.id, user_id: user.id }));
      },
      [dispatch, user]
    );

    const handleClickRemoveFavorite = useCallback(
      (event, logo: BuilderLogo) => {
        stopPropagation(event);

        const favoriteLogoItem = favoriteLogoList.find(
          (item) => item.logo_id === logo.id
        );

        if (!favoriteLogoItem) return;

        dispatch(deleteFavoriteLogoItem(favoriteLogoItem.id));
      },
      [dispatch, favoriteLogoList]
    );

    const renderLogoList = (logoList: BuilderLogo[]) => (
      <CustomImageList rowHeight="auto" cols={isAboveMobile ? 3 : 1} gap={10}>
        {logoList.map((logo) => {
          const isFavorite = favoriteLogoIDs.includes(logo.id);

          return (
            <CustomImageListItem
              key={logo.id}
              cols={1}
              onClick={() => onOpen(logo)}
            >
              <ImageWithLoad
                src={`${config.assetsURL}/${logo.preview_file}`}
                alt={logo.name}
                alignItems="center"
                height="100%"
                maxHeight="250px"
              />
              <ImageListItemBar
                position="top"
                actionIcon={
                  <IconButton
                    color="secondary"
                    onClick={(event) =>
                      isFavorite
                        ? handleClickRemoveFavorite(event, logo)
                        : handleClickAddFavorite(event, logo)
                    }
                  >
                    <FontAwesomeIcon
                      icon={isFavorite ? faStarOn : faStarOff}
                      size="sm"
                    />
                  </IconButton>
                }
              />
            </CustomImageListItem>
          );
        })}
      </CustomImageList>
    );

    return (
      <Box
        id="logo-dialog-content"
        overflow="auto"
        height="min(700px, calc(100vh - 300px))"
      >
        <InfiniteScroll
          dataLength={logoLimit} //This is important field to render the next data
          next={increaseLogoData}
          hasMore={logoLimit < filteredLogos.length}
          loader={<Loader />}
          scrollableTarget="logo-dialog-content"
        >
          {favoriteFilteredLogos.length ? (
            <>
              <CategoryText color="secondary">Favorite</CategoryText>
              {renderLogoList(favoriteFilteredLogos)}
              <CategoryText color="secondary">All</CategoryText>
            </>
          ) : (
            <></>
          )}
          {renderLogoList(
            filteredLogos.slice(
              0,
              Math.max(logoLimit - favoriteFilteredLogos.length, 4)
            )
          )}
        </InfiniteScroll>
      </Box>
    );
  }
);
