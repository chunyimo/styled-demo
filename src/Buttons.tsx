import React from "react";
import {
  BaseButton,
  Button,
  PinkButton,
  PrimaryButton,
  Whitea,
} from "./components/Button";
export default function Buttons() {
  return (
    <div className={"home"}>
      <h3>Buttons</h3>
      <div>
        <Button type="button">Base Button</Button>
        <PrimaryButton>Primary button</PrimaryButton>
        <BaseButton bt="dashed" primary>
          Base Button
        </BaseButton>
        <Whitea>hahah</Whitea>
        <PinkButton>PinkButton</PinkButton>
      </div>
    </div>
  );
}
