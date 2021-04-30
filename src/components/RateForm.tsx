import React, { useState } from "react"
import { Button, Form, InputNumber } from "antd"
import { ICurrencyExchange } from "../dal/currency"
import { getAetherInWax, getConverters, getWaxInUSDT } from "../domain/currency"

export interface IForm {
  aether: number
  wax: number
  usdt: number
}

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>
}

export default function RateForm(props: IProps): JSX.Element {
  const { currencyExchange } = props
  const converters = getConverters(currencyExchange)

  const calcNewState: Record<keyof IForm, (newValue: number) => IForm> = {
    aether: (aether): IForm => {
      const wax = converters.aetherToWax(aether)
      const usdt = converters.waxToUsdt(wax)
      return { aether, wax, usdt }
    },
    wax: wax => {
      const aether = converters.waxToAether(wax)
      const usdt = converters.waxToUsdt(wax)
      return { aether, wax, usdt }
    },
    usdt: usdt => {
      const wax = converters.usdtToWax(usdt)
      const aether = converters.waxToAether(wax)
      return { aether, wax, usdt }
    },
  }

  const [form, setForm] = useState<IForm>(calcNewState.usdt(1))

  function onChange(currency: keyof IForm) {
    return (newValue: number) => {
      setForm(calcNewState[currency](newValue))
    }
  }

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Form.Item label={"AETHER"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.aether}
          onChange={onChange("aether")}
          precision={9}
        />
      </Form.Item>

      <Form.Item label={"WAX"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.wax}
          onChange={onChange("wax")}
          precision={9}
        />
      </Form.Item>

      <Form.Item label={"USDT"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.usdt}
          onChange={onChange("usdt")}
          precision={9}
        />
      </Form.Item>

      <Button htmlType="reset" onClick={() => setForm(calcNewState.usdt(1))}>
        Reset
      </Button>
    </Form>
  )
}
