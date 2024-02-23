import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Switch,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import { Form, Formik, FormikProps } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NumberModSwitch } from "src/components/common";
import { decodeHtml } from "src/helper";
import { RootState } from "src/redux";
import { ConfigCatFlags } from "src/types/enum";
import { CarRaceLeague, CarRaceTeam } from "src/types/query";
import styled from "styled-components";
import * as Yup from "yup";

type RaceDialogFormValues = {
  night: boolean;
  primary: boolean;
  num: string;
  series: number[];
  team: number[];
};

type RaceDialogProps = {
  open: boolean;
  applying: boolean;
  onApply: (values: RaceDialogFormValues) => void;
  onCancel: () => void;
};

export const RaceDialog = React.memo(
  ({ open, applying, onApply, onCancel }: RaceDialogProps) => {
    const cars = useSelector((state: RootState) => state.carReducer.cars);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );

    const [number, setNumber] = useState(currentScheme?.last_number ?? 0);
    const [expanded, setExpanded] = useState(false);

    const initialValues: RaceDialogFormValues = useMemo(
      () => ({
        night: true,
        primary: true,
        num: cars[number] ? cars[number].num || "" : "",
        series:
          cars[number] && cars[number].leagues
            ? cars[number].leagues
                .filter((item) => item.racing)
                .map((item) => item.series_id)
            : [],
        team:
          cars[number] && cars[number].teams
            ? cars[number].teams
                .filter((item) => item.racing)
                .map((item) => item.team_id)
            : [],
      }),
      [cars, number]
    );

    const validationSchema = useMemo(
      () =>
        Yup.object().shape({
          night: Yup.boolean(),
          primary: Yup.boolean(),
          num: number ? Yup.string().required("Required") : Yup.string(),
          series: Yup.array().of(Yup.number()),
          team: Yup.array().of(Yup.number()),
        }),
      [number]
    );

    const handleSubmit = useCallback(
      (values) => {
        const payload = {
          ...values,
          number,
        };
        if (!expanded) {
          payload.primary = true;
        }
        if (payload.primary) {
          payload.night = false;
        }
        onApply(payload);
      },
      [number, expanded, onApply]
    );

    useEffect(() => {
      if (cars && cars.length) {
        if (cars[1].primary === true || cars[0].primary === true) {
          if (cars[1].primary === true) {
            setNumber(1);
          } else {
            setNumber(0);
          }
        } else {
          setNumber(currentScheme?.last_number ?? 0);
        }
      }
      // Should Initialize when open status changes too.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, cars]);

    return (
      <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
        <DialogTitle>Race this paint?</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount
        >
          {(formProps) => (
            <RaceForm
              onCancel={onCancel}
              number={number}
              applying={applying}
              setNumber={setNumber}
              leagueList={cars[number] ? cars[number].leagues : []}
              teamList={cars[number] ? cars[number].teams : []}
              expanded={expanded}
              setExpanded={setExpanded}
              {...formProps}
            />
          )}
        </Formik>
      </Dialog>
    );
  }
);

type RaceFormProps = {
  onCancel: () => void;
  applying: boolean;
  number: number;
  setNumber: (number: number) => void;
  leagueList: CarRaceLeague[];
  teamList: CarRaceTeam[];
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
} & FormikProps<RaceDialogFormValues>;

const RaceForm = React.memo(
  ({
    onCancel,
    leagueList,
    teamList,
    applying,
    number,
    setNumber,
    expanded,
    setExpanded,
    ...formProps
  }: RaceFormProps) => {
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const cars = useSelector((state: RootState) => state.carReducer.cars);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const { value: helpLinkSpecTga } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_SPEC_TGA,
      ""
    );
    const { value: helpLinkRacingNumbers } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_RACING_NUMBERS,
      ""
    );

    const leagueSeriesMap = useMemo(() => {
      const map: Record<number, string> = {};
      for (const item of leagueList) {
        map[item.series_id] = item.league_name + " " + item.series_name;
      }
      return map;
    }, [leagueList]);

    const teamMap = useMemo(() => {
      const map: Record<number, string> = {};
      for (const item of teamList) {
        map[item.team_id] = item.team_name;
      }
      return map;
    }, [teamList]);

    const handleChangeNumber = useCallback(
      (number) => {
        setNumber(number ? 1 : 0);
        formProps.resetForm();
      },
      [formProps, setNumber]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <DialogContent dividers id="insert-text-dialog-content">
          <Box display="flex" flexDirection="column">
            {!currentScheme?.hide_spec ? (
              <Box
                bgcolor="#666"
                p="10px 16px"
                borderRadius={10}
                border="2px solid navajowhite"
                position="relative"
                mb="10px"
              >
                <Typography>
                  In order to race with or assign a Paint Builder-generated spec
                  map that shows your selected Finish options, you&apos;ll need
                  to obtain and upload a MIP file from iRacing.{" "}
                  <Link
                    href={helpLinkSpecTga}
                    color="secondary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn how
                  </Link>
                </Typography>
              </Box>
            ) : (
              <></>
            )}
            <Typography style={{ marginBottom: "12px" }}>
              Race this paint as your {decodeHtml(currentCarMake?.name)}?
            </Typography>
            <Box
              mb={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SelectionWrapper
                container
                justifyContent={isAboveMobile ? "center" : "flex-start"}
                alignItems="center"
                spacing={1}
              >
                {isAboveMobile ? (
                  <CustomGrid item onClick={() => handleChangeNumber(0)}>
                    <Typography>Sim-Stamped Number</Typography>
                  </CustomGrid>
                ) : (
                  <></>
                )}
                <Grid item>
                  <NumberModSwitch
                    checked={number ? true : false}
                    onChange={(event) =>
                      handleChangeNumber(event.target.checked)
                    }
                    name="number"
                  />
                </Grid>
                <CustomGrid
                  item
                  style={{ display: isAboveMobile ? "block" : "flex" }}
                  onClick={() => handleChangeNumber(1)}
                >
                  {isAboveMobile ? (
                    <Typography>Custom Number</Typography>
                  ) : (
                    <Typography>{number ? "Custom" : "Sim-Stamped"}</Typography>
                  )}

                  <Box
                    position={isAboveMobile ? "absolute" : "relative"}
                    left={isAboveMobile ? "calc(50% + 180px)" : 0}
                    top={isAboveMobile ? "6px" : 0}
                  >
                    {number ? (
                      <CustomTextField
                        placeholder="Number"
                        name="num"
                        type="tel"
                        value={formProps.values.num}
                        inputProps={{ maxLength: 3 }}
                        onBlur={formProps.handleBlur}
                        onChange={formProps.handleChange}
                        error={Boolean(
                          formProps.touched.num && formProps.errors.num
                        )}
                        helperText={
                          formProps.touched.num && formProps.errors.num
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </Box>
                </CustomGrid>
              </SelectionWrapper>
              <MoreInfo
                href={helpLinkRacingNumbers}
                target="_blank"
                rel="noreferrer"
              >
                More Info
              </MoreInfo>
            </Box>
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
            >
              <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">More Options</Typography>
              </CustomAccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%" pt={3}>
                  <Grid container style={{ marginBottom: "1rem" }}>
                    <Grid item xs={isAboveMobile ? 6 : 12}>
                      <FormControlLabel
                        label="Primary paint"
                        control={
                          <Switch
                            checked={formProps.values.primary}
                            onChange={(event) => {
                              formProps.setFieldValue(
                                "primary",
                                event.target.checked
                              );
                              if (event.target.checked) {
                                formProps.setFieldValue("night", true);
                              }
                            }}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={isAboveMobile ? 6 : 12}>
                      <FormControlLabel
                        label="Night races"
                        control={
                          <Switch
                            checked={formProps.values.night}
                            disabled={
                              formProps.values.night &&
                              formProps.values.primary &&
                              cars.every((car) => !car.night)
                            }
                            onChange={(event) =>
                              formProps.setFieldValue(
                                "night",
                                event.target.checked
                              )
                            }
                          />
                        }
                      />
                    </Grid>
                  </Grid>

                  {leagueList.length ? (
                    <Box width="100%" mb={4}>
                      <CustomFormControl variant="outlined">
                        <InputLabel id="leagues-and-series">
                          Leagues and series
                        </InputLabel>
                        <Select
                          labelId="leagues-and-series"
                          label="Leagues and series"
                          value={formProps.values.series}
                          multiple
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "series",
                              event.target.value
                            )
                          }
                          renderValue={(selected) => (
                            <Box display="flex" flexWrap="wrap">
                              {(selected as number[]).map((value, index) => (
                                <Box key={index} m={1}>
                                  <Chip label={leagueSeriesMap[value]} />
                                </Box>
                              ))}
                            </Box>
                          )}
                        >
                          {leagueList.map((leatueSeriesItem, index) => (
                            <MenuItem
                              value={leatueSeriesItem.series_id}
                              key={index}
                            >
                              {leatueSeriesItem.league_name}{" "}
                              {leatueSeriesItem.series_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {teamList.length ? (
                    <Box width="100%">
                      <CustomFormControl variant="outlined">
                        <InputLabel id="teams">Teams</InputLabel>
                        <Select
                          labelId="teams"
                          label="Teams"
                          multiple
                          value={formProps.values.team}
                          onChange={(event) =>
                            formProps.setFieldValue("team", event.target.value)
                          }
                          renderValue={(selected) => (
                            <Box display="flex" flexWrap="wrap">
                              {(selected as number[]).map((value, index) => (
                                <Box key={index} m={1}>
                                  <Chip label={teamMap[value]} />
                                </Box>
                              ))}
                            </Box>
                          )}
                        >
                          {teamList.map((teamItem, index) => (
                            <MenuItem value={teamItem.team_id} key={index}>
                              {teamItem.team_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>

          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={formProps.isSubmitting || !formProps.isValid}
          >
            {applying ? <CircularProgress size={20} /> : "Apply"}
          </Button>
        </DialogActions>
      </Form>
    );
  }
);

const CustomFormControl = styled(FormControl)`
  flex-grow: 1;
  width: 100%;
  .MuiInputBase-root {
    min-height: 48px;
  }
`;

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

const SelectionWrapper = styled(Grid)`
  position: relative;
`;

const CustomTextField = styled(TextField)`
  margin: 0 10px;
  width: 65px;
  & .MuiInputBase-input {
    height: auto;
    border-bottom: 1px solid white;
    padding: 3px 0 4px;
  }
`;

export const CustomAccordionSummary = styled(AccordionSummary)`
  background: #3f3f3f;
  border-radius: 5px;
`;

const MoreInfo = styled.a`
  font-size: 13px;
  font-family: CircularXXWeb-Regular;
  color: #f48fb1;
  text-decoration: none;
  width: 70px;
`;

export default RaceDialog;
