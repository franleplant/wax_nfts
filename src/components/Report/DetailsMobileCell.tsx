import React from "react";
import { IReportRow } from "../../dal/report";
import { Tag, Tooltip } from "antd";

export interface IProps {
  row: IReportRow;
}

export default function PriceCell(props: IProps): JSX.Element {
  const { row } = props;

  const trigger = ["hover", "focus", "click"];

  const data = row.immutable_data;
  const rarity = data.rarity || data.Rarity;
  let rarityEl = null;
  if (rarity) {
    rarityEl = (
      <Tooltip title="rarity" trigger={trigger}>
        <Tag
          color="orange"
          style={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {rarity}
        </Tag>
      </Tooltip>
    );
  }
  return (
    <>
      <Tooltip title="template id" trigger={trigger}>
        <Tag title="template id">{row.template_id}</Tag>
      </Tooltip>
      <Tooltip title="name" trigger={trigger}>
        <Tag color="geekblue" title="name">
          {row.name}
        </Tag>
      </Tooltip>
      <Tooltip title="schema" trigger={trigger}>
        <Tag color="blue" title="schema">
          {row.schema}
        </Tag>
      </Tooltip>
      <Tooltip title="collection" trigger={trigger}>
        <Tag color="cyan" title="collection">
          {row.collection}
        </Tag>
      </Tooltip>
      {rarityEl}
    </>
  );
}
