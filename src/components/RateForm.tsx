import React, { useEffect, useState } from "react"

export interface IForm {
  quote: number | undefined
  base: number | undefined
}

export interface IProps {
  rate: number
}

export default function RateForm({ rate }: IProps): JSX.Element {
  const [form, setForm] = useState<IForm>({ quote: rate, base: 1 })

  function onQuoteChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const quote = Number(e.target.value)
    const base = quote / rate
    setForm({ quote, base })
  }

  function onBaseChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const base = Number(e.target.value)
    const quote = base * rate
    setForm({ quote, base })
  }

  return (
    <form>
      <label>
        <input type="number" value={form.quote} onChange={onQuoteChange} />
        <span> AETHER </span>
      </label>
      <input type="number" value={form.base} onChange={onBaseChange} />
      <span> USDT </span>
    </form>
  )
}
