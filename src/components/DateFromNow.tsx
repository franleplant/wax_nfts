import React from "react";
import moment from "moment";
import "moment/locale/es";

export interface IProps {
  // the one that comes from IPrice
  date: string;
}

export default function DateFromNow({ date: dateString }: IProps): JSX.Element {
  moment.locale("es");
  const date = moment(dateString, "DD/MM/YYYY - HH:mm");
  return <span>{date.fromNow()} </span>;
}
