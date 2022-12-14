import Decimal from "decimal.js";
import { web3 } from "../loaders/web3";
import { ZERO_BD } from "./constants";

export function exponentToBigDecimal(decimals: number): Decimal {
  let bd = new Decimal("1");
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(new Decimal("10"));
  }
  return bd;
}

export function bigDecimalExp18(): Decimal {
  return new Decimal("1000000000000000000");
}

export function convertEthToDecimal(eth: Decimal): Decimal {
  return eth.div(exponentToBigDecimal(18));
}

export function convertTokenToDecimal(
  tokenAmount: Decimal,
  exchangeDecimals: number
): Decimal {
  if (exchangeDecimals == 0) {
    return tokenAmount;
  }
  return new Decimal(tokenAmount.toString()).div(exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: Decimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(ZERO_BD.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}
export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export async function getTimestamp(blockNumber: number) {
  let block: any = await web3.eth.getBlock(blockNumber);
  return block.timestamp;
}

export function convertToDecimal(decimal128: any) {
  if (decimal128 == null || decimal128 == undefined) {
    return ZERO_BD;
  }
  return new Decimal(decimal128.toString());
}
