import { IconButton } from "@material-ui/core";
import { Link as LinkIcon, LinkOff as LinkOfficon } from "@material-ui/icons";
import styled from "styled-components/macro";

export const CustomIconButton = styled(IconButton)<{ locked?: string }>`
  margin: 5px 5px 0;
  height: 40px;
  background: ${(props) => (props.locked === "true" ? "#15151580" : "")};
`;

export { LinkIcon, LinkOfficon };
