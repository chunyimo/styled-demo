import styled from "../styled/index";
import { css } from "styled-components";
import { Button as MButton } from "@material-ui/core";
import { styled as Mstyled } from "@material-ui/styles";
import mstyled from "../mstyled";
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
// @ts-ignore
export const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: ${(props: any) => borderStyle(props.bt)};
  color: ${(props: any) => (props.primary ? "#75dddd" : "gray")};
  margin: 0 1em;
  padding: 0.25em 1em;
`;
// @ts-ignore
export const Whitea = styled.a`
  color: white;
`;

export const BaseButton = (props: any) => {
  return <Button {...props} />;
};
// @ts-ignore
export const PrimaryButton = styled(Button)`
  background: #75dddd;
  color: white;
`;

export const PinkButton = Mstyled(MButton)({
  background: "pink",
});

export const CustomButton = mstyled("button")`
  color: #fc8621;
  font-size: ${(props: any) => (props.f32 ? "32px" : "16px")}
`;
console.log(Button);
console.log(CustomButton);
