import { pick } from "lodash";
import React from "react";
import { IReportRow } from "../../dal/report";

export interface IProps {
  row: IReportRow;
}

export default function DataCell(props: IProps): JSX.Element {
  const data = pick(props.row.immutable_data, [
    "rarity",
    "Rarity",
    "Variant",
    "variantion",
    "description",
    "race",
  ]);
  return (
    <dl
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "5px",
        width: "172px",
        overflow: "hidden",
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ overflow: "hidden" }}>
          <dt>{key}</dt>
          <dl>{`${value}`}</dl>
        </div>
      ))}
    </dl>
  );
}
