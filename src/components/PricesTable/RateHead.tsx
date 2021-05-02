import React, { useContext } from "react";
import { Button } from "antd";
import RateContext from "./RateContext";

export interface IProps {}

export default function ReatHead(_props: IProps): JSX.Element {
  const ctx = useContext(RateContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ lineHeight: "31px" }}>Rates</span>

      <Button htmlType="reset" onClick={() => ctx.reset()}>
        Reset
      </Button>
    </div>
  );
}
