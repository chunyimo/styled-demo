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
        <Button type="button">Base Button</Button>
        <PrimaryButton>Primary button</PrimaryButton>
        <BaseButton
          onClick={changeBorderStyleIndex}
          bt={borderStyle[borderStyleIndex]}
          primary
        >
          Base Button
        </BaseButton>
        <Whitea>hahah</Whitea>
        <PinkButton>PinkButton</PinkButton>
        <CustomButton>CustomButton</CustomButton>
        <CustomButton onClick={toggle} f32={fontSizeToggle}>
          CustomButton
        </CustomButton>
      </div>
    </div>
  );
}
