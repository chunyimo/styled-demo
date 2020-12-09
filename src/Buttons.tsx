import React, { useState } from "react";
import {
  BaseButton,
  Button,
  CustomButton,
  PinkButton,
  PrimaryButton,
  Whitea,
} from "./components/Button";
const borderStyle = ["dashed", "dotted", "double", "solid"];
export default function Buttons() {
  const [fontSizeToggle, setFontSizeToggle] = useState(false);
  const [borderStyleIndex, setBorderStyleIndex] = useState(0);
  const toggle = () => {
    setFontSizeToggle((v) => !v);
  };
  const changeBorderStyleIndex = () => {
    setBorderStyleIndex((v) => (v + 1) % borderStyle.length);
  };
  return (
    <div className={"home"}>
      <h3>Buttons</h3>
      <div>
        <h1>Styled Components</h1>
        <Whitea>hahah</Whitea>
        <Button type="button">Base Button</Button>
        <PrimaryButton>Primary button</PrimaryButton>
        <BaseButton
          onClick={changeBorderStyleIndex}
          bt={borderStyle[borderStyleIndex]}
          primary
        >
          Base Button
        </BaseButton>
        <h1>Material UI</h1>
        <PinkButton>PinkButton</PinkButton>
        <h1>Weak chicken Styled component</h1>
        <CustomButton>CustomButton1</CustomButton>
        <CustomButton onClick={toggle} f32={fontSizeToggle}>
          CustomButton2
        </CustomButton>
      </div>
    </div>
  );
}
