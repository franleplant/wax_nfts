import { createContext } from "react"
import { ICurrencyExchange } from "../../dal/currency"

const CurrencyExchangeContext = createContext<Array<ICurrencyExchange>>([])

export default CurrencyExchangeContext
