import React, { useEffect, useState } from "react"
import { PageProps, Link, graphql } from "gatsby"
import Price from "../components/Price"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import PriceTable from "../components/PriceTable"

export interface IData {
  data: {
    site: {
      buildTime: string
    }
  }
}

export default function Index(props: PageProps<IData>) {
  return (
    <Layout>
      <SEO />
      <div className="one-page price__wrapper flow">
        <Price />
      </div>
      <div className="one-page wrapper__desktop" id="todos-los-precios">
        <h3 className="text-center">Todos las cotizaciones</h3>
        <PriceTable />
      </div>
      <div className="wrapper text-center page__wrapper">
        <section>
          <h4>Que es el dolar blue?</h4>
          <p>
            El dolar blue o dolar paralelo o dolar informal se refiere a la
            cantidad de pesos argentinos que se necesitan para comprar un dolar
            estadounidense en el mercado informal.
          </p>

          <p>
            Este mercado es muchas veces referido como informal, paralelo o
            hasta ilegal ya que el estado argentino tiene estrictos controles de
            cambio que se alinean con una política monetaria que históricamente
            ha tenido muchos problemas y es por eso que intenta restringir este
            mercado..
          </p>

          <p>
            El estado considera que el MUL (el mercado único libre) de cambio es
            justamente "libre" y "único", cosa que es difícil de entender como
            cierta ya que no es único porque existen una variedad de mercados
            cambiarios entre el ilegal y el MEP (dólar bolsa) o CCL (dólar
            contado con liqui) pero tampoco es "libre" ya que el estado
            argentino ha puesto mas y mas trabas para acceder al "dólar
            oficial".
          </p>

          <p>
            Por otro lado el Dólar Blue constituye dos cosas: 1) un indicador
            del estado de la confianza en la moneda local, mediante la
            comparación del dolar blue con el dolar oficial se mide la
            desconfianza, mientras mayor sea la brecha mas sera la desconfianza
            y; 2) un indicador del estado de la economia argentina a traves de
            la brecha entre el blue y el oficial.
          </p>

          <p>
            Históricamente esta brecha cuando superia el 100% es un indicador
            muy claro de una crisis que se avecina, es por eso que el pueblo
            tiene que saber protegerse de este ataque a su bolsillo.
          </p>

          <p>
            La inflación es un impuesto que afecta a los mas pobres, genera aun
            mas pobreza y constituye un robo y una tradición a la confianza del
            pueblo; aprende! formate! y liberate!
          </p>

          <p>
            El otro instrumento de escape mas y mas están siendo las
            criptomonedas, también te recomiendo que aprendas sobre ellas.
          </p>

          <div style={{ textAlign: "start" }}>
            Informate:
            <ul>
              <li>
                <a
                  href="https://www.ambito.com/contenidos/dolar.html"
                  target="__blank"
                >
                  Ambito Financiero
                </a>
              </li>
              <li>
                <a
                  href="https://www.dolarhoy.com/cotizaciondolarblue"
                  target="__blank"
                >
                  dolarhoy.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
                  target="__blank"
                >
                  Cronista
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query buildTime {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`
