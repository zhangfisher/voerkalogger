/**
 * @author
 * @file index.tsx
 * @fileBase test
 * @path projects\web-client\src\pages\test\index.tsx
 * @from 
 * @desc 
 * @example
 */

import { useState, useEffect, memo } from "react"
interface Props {
  // value: propTypes.any
}
import LogManager from './log'
export const Test:React.FC<Props> = ()=> {
  return (
    <div>
      <LogManager></LogManager>
    </div>
  )
}
export default Test