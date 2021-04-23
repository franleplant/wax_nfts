import React from "react"

export interface IProps {
  trend: "up" | "down" | "equal"
}

export default function TrendIcon({ trend }: IProps) {
  return <span>{getIcon(trend)}</span>
}

function getIcon(trend: "up" | "down" | "equal"): string {
  switch (trend) {
    case "up": {
      return "👍"
    }
    case "down": {
      return "👎"
    }
    case "equal": {
      return "🤞"
    }
    default: {
      return ""
    }
  }
}
