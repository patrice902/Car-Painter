import { Box } from "@material-ui/core";
import React, { useState } from "react";

import { CustomImg, CustomSkeleton } from "./ImageWithLoad.style";

type ImageWithLoadProps = {
  id?: string;
  src: string;
  altSrc?: string;
  fallbackSrc?: string;
  alt?: string;
  onClick?: () => void;
  ImageComponent?: React.ElementType;
  minHeight?: string | number;
  minWidth?: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
  height?: string | number;
  width?: string | number;
  justifyContent?: string;
  overflow?: string;
  alignItems?: string;
  cursorPointer?: boolean;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
};

export const ImageWithLoad = React.memo(
  ({
    id,
    src,
    altSrc,
    fallbackSrc,
    alt,
    onClick,
    ImageComponent,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    height,
    width,
    justifyContent = "center",
    alignItems = "start",
    cursorPointer = false,
    overflow,
    imageProps,
  }: ImageWithLoadProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <Box
        id={id}
        position="relative"
        minHeight={minHeight}
        minWidth={minWidth}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        height={height}
        width={width}
        display="flex"
        justifyContent={justifyContent}
        alignItems={alignItems}
        overflow={overflow}
      >
        {ImageComponent ? (
          <ImageComponent
            src={src}
            alt={alt}
            {...imageProps}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <CustomImg
            src={src}
            alt={alt}
            {...imageProps}
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
