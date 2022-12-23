import styled from "styled-components/macro";

import { Typography, CardContent } from "@material-ui/core";

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
