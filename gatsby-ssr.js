/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

import "antd/dist/antd.css"

import React from "react"
import AppWrapper from "./src/components/AppWrapper"
import "./src/declarations.d.ts"

// Wraps every page in a component
export function wrapPageElement({ element, props }) {
  return <AppWrapper {...props}>{element}</AppWrapper>
}
