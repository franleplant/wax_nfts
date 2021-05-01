import React, { useState } from "react";
import { Button, Form, InputNumber } from "antd";
import { ICurrencyExchange } from "../dal/currency";
import { convert, getAllInUSDT, Token } from "../domain/currency";

export type IForm = Record<Token, number>;

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>;
}

export default function RateForm(props: IProps): JSX.Element {
  const { currencyExchange } = props;
  const rates = getAllInUSDT(currencyExchange);

  function calcNewState(tokenFrom: Token, newValue: number): IForm {
    const valueInUsdt = rates[tokenFrom] * newValue;

    const form = { [tokenFrom]: newValue } as IForm;
    Object.values(Token)
      .filter((tokenTo) => tokenTo !== tokenFrom)
      .forEach((tokenTo) => {
        form[tokenTo] = convert(valueInUsdt, tokenTo, rates);
      });

    return form;
  }

  const [form, setForm] = useState<IForm>(calcNewState(Token.USDT, 1));

  function onChange(tokenFrom: Token) {
    return (newValue: number) => {
      setForm(calcNewState(tokenFrom, newValue));
    };
  }

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Form.Item label={"AETHER"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.aether}
          onChange={onChange(Token.AETHER)}
          precision={9}
        />
      </Form.Item>

      <Form.Item label={"WAX"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.wax}
          onChange={onChange(Token.WAX)}
          precision={9}
        />
      </Form.Item>

      <Form.Item label={"USDT"}>
        <InputNumber
          style={{ width: "100%" }}
          value={form.usdt}
          onChange={onChange(Token.USDT)}
          precision={9}
        />
      </Form.Item>

      <Button
        htmlType="reset"
        onClick={() => setForm(calcNewState(Token.USDT, 1))}
      >
        Reset
      </Button>
    </Form>
  );
}
