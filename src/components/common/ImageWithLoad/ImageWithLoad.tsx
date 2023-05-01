import { Box } from "@material-ui/core";
import React, { useState } from "react";

import { CustomImg, CustomSkeleton } from "./ImageWithLoad.style";

type ImageWithLoadProps = {
  src: string;
  altSrc?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  ImageComponent?: React.ElementType;
  minHeight?: string | number;
  minWidth?: string | number;
  height?: string | number;
  justifyContent?: string;
  alignItems?: string;
  cursorPointer?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const ImageWithLoad = React.memo(
  ({
    src,
    altSrc,
    fallbackSrc,
    onClick,
    ImageComponent,
    minHeight = "100%",
    minWidth = "100%",
    height,
    justifyContent = "center",
    alignItems = "start",
    cursorPointer = false,
    ...props
  }: ImageWithLoadProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <Box
        position="relative"
        minHeight={minHeight}
        minWidth={minWidth}
        height={height}
        display="flex"
        justifyContent={justifyContent}
        alignItems={alignItems}
      >
        {ImageComponent ? (
          <ImageComponent
            src={src}
            {...props}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <CustomImg
            src={src}
            {...props}
            cursorPointer={cursorPointer}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;

              if (target.src !== altSrc && altSrc) target.src = altSrc;
              else if (target.src !== fallbackSrc && fallbackSrc)
                target.src = fallbackSrc;
            }}
          />
        )}
        {!loaded ? <CustomSkeleton variant="rect" onClick={onClick} /> : <></>}
      </Box>
    );
  }
);
