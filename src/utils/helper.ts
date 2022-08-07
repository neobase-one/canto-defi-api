import Decimal from "decimal.js";
import { ZERO_BD } from "./constants";

export function exponentToBigDecimal(decimals: number): Decimal {
  let bd = new Decimal("1");
  for (let i = 0; i < decimals; i = i++) {
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
  return tokenAmount.div(exponentToBigDecimal(exchangeDecimals));
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
