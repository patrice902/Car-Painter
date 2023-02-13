import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import styled from "styled-components/macro";

export const MainSpeedDial = styled(SpeedDial)`
  position: absolute;
  top: 0px;
  right: 10px;
  .MuiSpeedDial-fab {
    width: 40px;
    height: 40px;
  }
  .MuiSpeedDial-actions {
    padding-right: 38px;
  }
`;

export const ShapesSpeedDialAction = styled(SpeedDialAction)`
  margin: 8px 4px;
  background: transparent;
  &:hover {
    background: transparent;
  }
`;

export const MainSpeedDialAction = styled(SpeedDialAction)`
  margin: 8px 4px;
`;

export const SubSpeedDial = styled(SpeedDial)`
  position: absolute;
  top: 0px;
  .MuiSpeedDial-fab {
    width: 40px;
    height: 40px;
    &[aria-expanded="false"] {
      background: #222;
    }
  }
  .MuiSpeedDial-actions {
    flex-wrap: wrap;
    padding-top: 38px;
    padding-right: 32px;
    width: 100vw;
    position: fixed;
    padding: 0;
    right: 0;
    margin: 0;
    flex-direction: row-reverse;
    top: 102px;
    right: 8px;
  }
`;

export const SubSpeedDialAction = styled(SpeedDialAction)`
  margin: 4px;
  color: ${(props) => (props.active ? "white" : "inherit")};
  background: ${(props) => (props.active ? "#a3c1ed" : "#222")};
`;

export const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;
