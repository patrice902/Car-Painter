import { CircularProgress } from "@material-ui/core";
import styled from "styled-components/macro";

export const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 60px;
`;

export const Progress = styled(CircularProgress)`
  margin: 8px;
`;
