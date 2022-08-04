import { ASTNode, GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",

  serialize(value: ObjectId): string {
    return value.toHexString();
  },

  parseValue(value: string): ObjectId {
    return new ObjectId(value);
  },

  parseLiteral(ast: ASTNode): ObjectId {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return new ObjectId();
  },
});
