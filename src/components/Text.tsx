import React from "react";
const Text = (props: any) => {
  return <div className={`${props.className} Text`}>{props.children}</div>;
};

export default Text;
