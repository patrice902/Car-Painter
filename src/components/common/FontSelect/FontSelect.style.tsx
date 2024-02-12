import { Select } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomSelect = styled(Select)`
  .MuiMenu-paper {
    border: 1px solid gray;
  }
  .MuiSelect-selectMenu {
    display: flex;
    align-items: center;
    height: 2rem;
  }

  margin-bottom: 16px;
`;
export const FontImage = styled.img`
  height: 100%;
  filter: invert(1);
`;
