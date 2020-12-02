import styled from "../styled/index";
import { css } from "styled-components";
const borderStyle = (bt: any) => `2px ${bt} gray`;
const sbtn = styled.button;
export const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: ${(props: any) => borderStyle(props.bt)};
  color: ${(props: any) => (props.primary ? "#75dddd" : "gray")};
  margin: 0 1em;
  padding: 0.25em 1em;
`;

export const BaseButton = (props: any) => {
  return <Button {...props} />;
};

export const PrimaryButton = styled(Button)`
  background: #75dddd;
  color: white;
`;
