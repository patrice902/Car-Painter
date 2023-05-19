import { Box, Theme, useMediaQuery } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ImageWithLoad, Loader } from "src/components/common";
import config from "src/config";
import { BuilderLogo } from "src/types/model";

import { CustomImageList, CustomImageListItem } from "./common.style";

type LogoContentProps = {
  step: number;
  logos: BuilderLogo[];
  search: string;
  onOpen: (logo: BuilderLogo) => void;
};

export const LogoContent = React.memo(
  ({ step, logos, search, onOpen }: LogoContentProps) => {
    const [logoLimit, setLogoLimit] = useState(step);
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
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

    const increaseLogoData = useCallback(() => {
      setLogoLimit(logoLimit + step);
    }, [logoLimit, step, setLogoLimit]);

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
          <CustomImageList
            rowHeight="auto"
            cols={isAboveMobile ? 3 : 1}
            gap={10}
          >
            {filteredLogos.slice(0, logoLimit).map((logo) => (
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
              </CustomImageListItem>
            ))}
          </CustomImageList>
        </InfiniteScroll>
      </Box>
    );
  }
);
