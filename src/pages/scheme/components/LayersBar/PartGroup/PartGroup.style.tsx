import { CardContent, Typography } from "@material-ui/core";
import styled from "styled-components/macro";

export const HeaderTitle = styled(Typography)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-family: CircularXXWeb-Bold;
  font-size: 1rem;
`;

export const CustomCardContent = styled(CardContent)`
  padding-top: 0;
`;
