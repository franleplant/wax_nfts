import React, { useEffect, useState } from "react"
import { Button, Form, InputNumber } from "antd"
import { getAetherInUSDT, getWaxInUSDT } from "../domain/market"
import { IMarketData } from "../dal/market"

export interface IForm {
  /** aether per wax per hour */
  stakingRewardRatio: number
}

export interface IProps {
  marketData: Array<IMarketData>
}

export default function APY(props: IProps): JSX.Element {
  const [form, setForm] = useState<IForm>({ stakingRewardRatio: 0.5 })

  const waxInUsdt = getWaxInUSDT(props.marketData)?.last_price || 0
  const aetherInUsdt = getAetherInUSDT(props.marketData)

  // The anualised percentage yield in usd dollars.
  // A/W = stakingRewardRatio is in Aether / Wax
  // U/A = aetherInUsdt is USDT / Aether
  // U/W = waxInUsdt is  USDT / Wax
  //
  // A/W * U/A = U/W
  //
  // U/W / U/W = U/W * W/U = U/U (USDT rewards over USDT invested)
  //
  // And U/U is per hour, so to know the yearly value we need to multiple that
  // for 24 * 365
  //
  // This is not compounded so a simple multiplication works,
  // we will eventually work on an automatic compounding mechanism
  // that will make this much more profitable
  const hourlyYield = (form.stakingRewardRatio * aetherInUsdt) / waxInUsdt
  const apy = hourlyYield * 24 * 365

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
        <p>{`${(apy * 100).toFixed(2)} %`}</p>
        <p>{`${apy.toFixed(2)} x`}</p>
      </Form.Item>
    </Form>
  )
}
