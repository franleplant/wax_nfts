import React, { useState, useEffect } from "react"
import "./Loading.css"

const TIME = [
  "🕐",
  "🕑",
  "🕒",
  "🕓",
  "🕔",
  "🕕",
  "🕖",
  "🕗",
  "🕘",
  "🕙",
  "🕚",
  "🕛",
]

export interface IProps {
  //TODO
  style?: any
}

export default function Loading(props: IProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(index => (index + 1) % TIME.length)
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <span className="text-center" style={props.style}>
      {TIME[index]}
    </span>
  )
}
