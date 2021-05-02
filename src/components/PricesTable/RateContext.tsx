import React from "react";
import { Token } from "../../domain/currency";

export type IForm = Record<Token, number>;

export interface IRateContext {
  form?: IForm;
  onChange: (tokenFrom: Token) => (newValue: number) => void;
  reset: () => void;
}

const Context = React.createContext<IRateContext>({
  onChange: () => () => {
    /* fuck off eslint */
  },
  reset: () => {
    /* empty */
  },
});

export default Context;
