import { Loader } from "components/common";
import { Box, ImageListItemBar, useMediaQuery } from "components/MaterialUI";
import config from "config";
import React, { useCallback, useMemo, useState } from "react";

import {
  CustomImageList,
  CustomImageListItem,
  CustomImg,
  CustomInfiniteScroll,
} from "./common.style";

export const FlagContent = React.memo((props) => {
  const { step, logos, search, onOpen } = props;
  const [flagLimit, setFlagLimit] = useState(step);
  const isAboveMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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
    <Box id="flag-dialog-content" overflow="auto" height="calc(100vh - 300px)">
      <CustomInfiniteScroll
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
      </CustomInfiniteScroll>
    </Box>
  );
});
