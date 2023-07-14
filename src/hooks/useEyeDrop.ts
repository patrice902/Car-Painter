import * as React from "react";
import { useCallback } from "react";
import config from "src/config";
import { getColor, rgbToHex } from "src/helper/colorUtils";
import { RgbObj } from "src/helper/colorUtils/types";
import { targetToCanvas } from "src/helper/targetToCanvas";

const { useEffect, useState } = React;

type ReturnValue = {
  color: string;
  pickColor: () => void;
  cancelPickColor: () => void;
};

export type HookOptions = {
  once?: boolean;
  pickRadius?: number;
  cursorActive?: string;
  cursorInactive?: string;
  onPickStart?: () => void;
  onPickEnd?: (hexColor: string) => void;
  onPickCancel?: () => void;
  onChange?: (hexColor: string) => void;
};

export const useEyeDrop = ({
  once,
  pickRadius,
  cursorActive = "copy",
  cursorInactive = "auto",
  onPickStart,
  onPickEnd,
  onPickCancel,
  onChange,
}: HookOptions = {}): ReturnValue => {
  const [color, setColor] = useState("");
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState(
    false
  );

  const pickColor = () => {
    if (onPickStart) {
      onPickStart();
    }

    setPickingColorFromDocument(true);
  };

  const cancelPickColor = useCallback(() => {
    if (onPickCancel) {
      onPickCancel();
    }

    setPickingColorFromDocument(false);
  }, [onPickCancel]);

  const exitPickByEscKey = useCallback(
    (event: KeyboardEvent) => {
      event.code === "Escape" && pickingColorFromDocument && cancelPickColor();
    },
    [pickingColorFromDocument, cancelPickColor]
  );

  const updateColors = (rgbObj: RgbObj) => {
    setColor(rgbToHex(rgbObj));
  };

  const extractColor = useCallback(
    async (e: MouseEvent) => {
      try {
        const { target } = e;

        if (!target) return;

        document.body.style.cursor = "wait";
        const targetCanvas = await targetToCanvas(document.body);
        const rgbColor = getColor(targetCanvas, e, pickRadius);
        const hex = rgbToHex(rgbColor);

        onChange?.(hex);

        updateColors(rgbColor);
        once && setPickingColorFromDocument(false);
        onPickEnd?.(hex);
        document.body.style.cursor = cursorInactive;
      } catch (error) {
        if (config.env === "development") {
          console.log(error);
        }
      }
    },
    [cursorInactive, onChange, onPickEnd, once, pickRadius]
  );

  useEffect(() => {
    if (pickingColorFromDocument) {
      document.addEventListener("click", extractColor);
    }
    return () => {
      document.removeEventListener("click", extractColor);
    };
  }, [pickingColorFromDocument, once, extractColor]);

  // setup listener for the esc key
  useEffect(() => {
    if (pickingColorFromDocument) {
      document.addEventListener("keydown", exitPickByEscKey);
    }
    return () => {
      document.removeEventListener("keydown", exitPickByEscKey);
    };
  }, [pickingColorFromDocument, exitPickByEscKey]);

  useEffect(() => {
    if (document.body && cursorActive && cursorInactive) {
      document.body.style.cursor = pickingColorFromDocument
        ? cursorActive
        : cursorInactive;
    }
  }, [pickingColorFromDocument, cursorActive, cursorInactive]);

  return { color, pickColor, cancelPickColor };
};
