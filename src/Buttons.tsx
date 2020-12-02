import React from "react";
import { BaseButton, Button, PrimaryButton } from "./components/Button";
export default function Buttons() {
  return (
    <div className={"home"}>
      <h3>Buttons</h3>
      <div>
        <Button type="button">Base Button</Button>
        <BaseButton bt="dashed" primary>
          Base Button
        </BaseButton>
        <PrimaryButton>Primary button</PrimaryButton>
      </div>
    </div>
  );
}
