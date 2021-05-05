import React from "react";
import { IReportRow } from "../../dal/report";

export interface IProps {
  row: IReportRow;
}

export default function ImgCell(props: IProps): JSX.Element | null {
  const { img, video } = props.row.immutable_data;
  if (img) {
    const url = getUrl(img);

    return <img src={url} style={{ width: "100px" }} />;
  }

  if (video) {
    const url = getUrl(video);

    return (
      <video autoPlay loop playsInline style={{ width: "100px" }} muted>
        <source src={url} />
      </video>
    );
  }

  return null;
}

export function getUrl(value: string): string {
  try {
    new URL(value);
    return value;
  } catch (err) {
    return `https://ipfs.io/ipfs/${value}`;
  }
}
