import { ObjectId } from "mongodb";
import { getModelForClass, Prop as Property } from "@typegoose/typegoose";

export class IndexDb {
  readonly _id: ObjectId;

  @Property({default: 0, required: false})
  lastBlockNumber: number;

  constructor() {
    this._id = new ObjectId();
    this.lastBlockNumber = 0;
  }
}

export const IndexModel = getModelForClass(IndexDb);
