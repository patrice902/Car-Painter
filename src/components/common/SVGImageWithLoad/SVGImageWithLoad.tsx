import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { replaceColors, svgToURL, urlToString } from "src/helper/svg";

import { CustomImg, CustomSkeleton } from "./SVGImageWithLoad.style";

type SVGImageWithLoadProps = {
  src: string;
  onClick?: () => void;
  ImageComponent?: React.ElementType;
  minHeight?: string;
  minWidth?: string;
  justifyContent?: string;
  options?: {
    color?: string;
    stroke?: string;
    opacity?: number;
    strokeWidth?: number;
  };
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const SVGImageWithLoad = React.memo(
  ({
    src,
    onClick,
    ImageComponent,
    minHeight = "100%",
    minWidth = "100%",
    justifyContent = "center",
    options,
    ...props
  }: SVGImageWithLoadProps) => {
    const [imageSrc, setImageSrc] = useState<string>();
    const [loaded, setLoaded] = useState(false);

    const loadImage = async () => {
      let svgString = await urlToString(
        // src + `?timestamp=${new Date().toISOString()}`
        src
      );
      if (options) {
        svgString = replaceColors(svgString, {
          color: options.color,
          stroke: options.stroke,
          opacity: options.opacity,
          strokeWidth: options.strokeWidth,
        });
      }
      setImageSrc(svgToURL(svgString));
    };

    useEffect(() => {
      loadImage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Box
        position="relative"
        minHeight={minHeight}
        minWidth={minWidth}
        display="flex"
        justifyContent={justifyContent}
        alignItems="center"
      >
        {imageSrc && ImageComponent ? (
          <ImageComponent
            src={imageSrc}
            {...props}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
          />
        ) : imageSrc ? (
          <CustomImg
            src={imageSrc}
            {...props}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <></>
        )}
        {!imageSrc || !loaded ? (
          <CustomSkeleton variant="rect" onClick={onClick} />
        ) : (
          <></>
        )}
      </Box>
    );
  }
);
