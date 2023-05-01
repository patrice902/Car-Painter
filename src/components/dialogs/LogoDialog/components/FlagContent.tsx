import { Box, ImageListItemBar, Theme, useMediaQuery } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "src/components/common";
import config from "src/config";
import { BuilderLogo } from "src/types/model";

import {
  CustomImageList,
  CustomImageListItem,
  CustomImg,
} from "./common.style";

type FlagContentProps = {
  step: number;
  logos: BuilderLogo[];
  search: string;
  onOpen: (logo: BuilderLogo) => void;
};

export const FlagContent = React.memo(
  ({ step, logos, search, onOpen }: FlagContentProps) => {
    const [flagLimit, setFlagLimit] = useState(step);
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const filteredFlags = useMemo(
      () =>
        logos.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            item.type === "flag" &&
            item.active
        ),
      [logos, search]
    );

    const increaseFlagData = useCallback(() => {
      setFlagLimit(flagLimit + step);
    }, [flagLimit, step, setFlagLimit]);

    return (
      <Box
        id="flag-dialog-content"
        overflow="auto"
        height="calc(100vh - 300px)"
      >
        <InfiniteScroll
          dataLength={flagLimit} //This is important field to render the next data
          next={increaseFlagData}
          hasMore={flagLimit < filteredFlags.length}
          loader={<Loader />}
          scrollableTarget="flag-dialog-content"
        >
          <CustomImageList rowHeight={178} cols={isAboveMobile ? 3 : 1}>
            {filteredFlags.slice(0, flagLimit).map((logo) => (
              <CustomImageListItem
                key={logo.id}
                cols={1}
                onClick={() => onOpen(logo)}
              >
                <CustomImg
                  src={`${config.assetsURL}/${logo.preview_file}`}
                  alt={logo.name}
                />
                <ImageListItemBar title={logo.name} />
              </CustomImageListItem>
            ))}
          </CustomImageList>
        </InfiniteScroll>
      </Box>
    );
  }
);
