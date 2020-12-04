import styled from "../styled/index";
import { css } from "styled-components";
import { Button as MButton } from "@material-ui/core";
import { styled as Mstyled } from "@material-ui/styles";
const borderStyle = (bt: any) => `2px ${bt} gray`;
// const sbtn = styled.button.attrs({ type: "button" })`
//   color: white;
// `;
// sbtn.attrs = [{ test: "testAttrs" }];
// const SSbtn = styled(sbtn)
//   .withConfig({ displayName: "SSbtn" })
//   .attrs({ cus: "SSbtn" })`
//   color: red;
// `;
export const Button = styled("button")`
  background: transparent;
  border-radius: 3px;
  border: ${(props: any) => borderStyle(props.bt)};
  color: ${(props: any) => (props.primary ? "#75dddd" : "gray")};
  margin: 0 1em;
  padding: 0.25em 1em;
`;

export const Whitea = styled.a`
  color: white;
`;

export const BaseButton = (props: any) => {
  return <Button {...props} />;
};

export const PrimaryButton = styled(Button)`
  background: #75dddd;
  color: white;
`;

export const PinkButton = Mstyled(MButton)({
  background: "pink",
});
