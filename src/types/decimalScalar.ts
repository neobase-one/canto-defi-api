import Decimal from "decimal.js";
import { GraphQLScalarType, Kind } from "graphql";

export const DecimalScalar = new GraphQLScalarType({
  name: "Decimal",
  description: "The `Decimal` scalar type to represent currency values",

  serialize(value) {
    return new Decimal(value.toString());
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      // @ts-ignore | TS2339
      throw new TypeError(`${String(ast.value)} is not a valid decimal value.`);
    }

    return new Decimal(ast.value.toString());
  },

  parseValue(value) {
    return new Decimal(value.toString());
  },
});
