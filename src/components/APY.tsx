import React, { useEffect, useState } from "react"
import { Button, Form, InputNumber } from "antd"
import { getYield } from "../domain/currency"
import { ICurrencyExchange } from "../dal/currency"

export interface IForm {
  /** aether per wax per hour */
  stakingRewardRatio: number
}

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>
}

export default function APY(props: IProps): JSX.Element {
  const [form, setForm] = useState<IForm>({ stakingRewardRatio: 0.5 })

  const yield_ = getYield(props.currencyExchange, form.stakingRewardRatio)

  return (
    <Form>
      <Form.Item label="stakingRewardRatio">
        <InputNumber
          style={{ width: "100%" }}
          value={form.stakingRewardRatio}
          onChange={stakingRewardRatio =>
            setForm(prevState => ({ ...prevState, stakingRewardRatio }))
          }
          precision={9}
        />
      </Form.Item>
      <Form.Item label="APY in USD">
        <p>{`${yield_.getApyFormatted()} %`}</p>
        <p>{`${yield_.getXFormatted()} x`}</p>
      </Form.Item>
    </Form>
  )
}
