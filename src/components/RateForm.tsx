import React, { useState } from "react"
import { Form, InputNumber, Button, Radio, Card } from "antd"

export interface IForm {
  quote: number | undefined
  base: number | undefined
}

export interface IProps {
  rate: number
  quoteLabel: string
  baseLabel: string
}

export default function RateForm({
  rate,
  quoteLabel,
  baseLabel,
}: IProps): JSX.Element {
  const [form, setForm] = useState<IForm>({ quote: rate, base: 1 })

  function onQuoteChange(quote: number): void {
    const base = quote / rate
    setForm({ quote, base })
  }

  function onBaseChange(base: number): void {
    const quote = base * rate
    setForm({ quote, base })
  }

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Form.Item label={quoteLabel}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.quote}
          onChange={onQuoteChange}
          precision={9}
        />
      </Form.Item>

      <Form.Item label={baseLabel}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.base}
          onChange={onBaseChange}
          precision={9}
        />
      </Form.Item>
    </Form>
  )
}
