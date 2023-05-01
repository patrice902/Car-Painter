import {
  FormControl,
  Grid,
  InputLabel,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import fitty from "fitty";
import { FormikProps } from "formik";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ColorPickerInput,
  FontSelect,
  SliderInput,
} from "src/components/common";
import config from "src/config";
import { RootState } from "src/redux";
import { insertToLoadedList as insertToLoadedFontList } from "src/redux/reducers/fontReducer";
import { BuilderFont } from "src/types/model";

import {
  CustomeTextField,
  TextPreview,
  TextPreviewWrapper,
} from "./InnerForm.style";
import { TextDialogFormValues } from "./model";

type InnerFormProps = {
  fontList: BuilderFont[];
  baseColor: string;
} & FormikProps<TextDialogFormValues>;

export const InnerForm = React.memo(
  ({
    fontList,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    baseColor,
  }: InnerFormProps) => {
    const dispatch = useDispatch();
    const loadedFontList = useSelector(
      (state: RootState) => state.fontReducer.loadedList
    );
    const previewBoxRef = useRef<HTMLDivElement>(null);
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const loadFont = useCallback(
      (fontFamily, fontFile) => {
        const fontObject = new FontFace(fontFamily, fontFile);
        fontObject
          .load()
          .then(function (loaded_face) {
            document.fonts.add(loaded_face);
            dispatch(insertToLoadedFontList(fontFamily));
          })
          .catch(function (error) {
            // error occurred
            console.warn(error, fontFamily);
          });
      },
      [dispatch]
    );

    const handleChangeFont = useCallback(
      (fontID) => {
        setFieldValue("font", fontID);
      },
      [setFieldValue]
    );

    const handleChangeStroke = useCallback(
      (value) => setFieldValue("stroke", value),
      [setFieldValue]
    );

    const handleChangeColor = useCallback(
      (color) => setFieldValue("color", color),
      [setFieldValue]
    );

    const handleChangeSColor = useCallback(
      (color) => setFieldValue("scolor", color),
      [setFieldValue]
    );

    useEffect(() => {
      const font = fontList.length
        ? fontList.find((item) => item.id === values.font)
        : null;
      if (font && !loadedFontList.includes(font.font_name)) {
        loadFont(font.font_name, `url(${config.assetsURL}/${font.font_file})`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.font]);

    useEffect(() => {
      fitty("#text-preview", {
        minSize: 10,
        maxSize: isAboveMobile ? 512 : 128,
        multiLine: false,
      });
    }, [values.text, values.font, isAboveMobile]);

    useEffect(() => {
      const adjustFont = (e: Event) => {
        setFieldValue(
          "size",
          Math.round(
            ((e as unknown) as { detail: { newValue: number } }).detail.newValue
          )
        );
      };

      if (previewBoxRef.current) {
        previewBoxRef.current.addEventListener("fit", adjustFont);
      }

      return () => {
        if (previewBoxRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          previewBoxRef.current.removeEventListener("fit", adjustFont);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <CustomeTextField
          name="text"
          label="Text"
          placeholder="Input Text here"
          variant="outlined"
          value={values.text}
          error={Boolean(touched.text && errors.text)}
          helperText={touched.text && errors.text}
          onBlur={handleBlur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ maxLength: 100 }}
          autoFocus={true}
        />
        <FormControl variant="outlined">
          <InputLabel id="font-select-label">Font</InputLabel>
          <FontSelect
            value={values.font}
            onChange={handleChangeFont}
            fontList={fontList}
          />
        </FormControl>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <SliderInput
              label="Stroke Width"
              min={0}
              max={10}
              value={values.stroke}
              setValue={handleChangeStroke}
            />
          </Grid>
          <Grid item xs={12} sm={6} />

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{ marginRight: "8px" }}
                >
                  Font Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.color}
                  onChange={handleChangeColor}
                  onInputChange={handleChangeColor}
                  error={Boolean(errors.color)}
                  helperText={errors.color}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{ marginRight: "8px" }}
                >
                  Stroke Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.scolor}
                  onChange={handleChangeSColor}
                  onInputChange={handleChangeSColor}
                  error={Boolean(errors.scolor)}
                  helperText={errors.scolor}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <TextPreviewWrapper
          width="100%"
          height={isAboveMobile ? "300px" : "100px"}
          my={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          backcolor={baseColor}
        >
          <TextPreview
            color={values.color}
            stroke={values.stroke}
            scolor={values.scolor}
            rotate={values.rotation}
            font={fontList.find((item) => item.id === values.font)?.font_name}
            id="text-preview"
            ref={previewBoxRef}
          >
            {values.text}
          </TextPreview>
        </TextPreviewWrapper>
      </>
    );
  }
);
