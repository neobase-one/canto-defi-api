import { ObjectId } from "mongodb";
import { getModelForClass, Prop, Prop as Property } from "@typegoose/typegoose";

export class EventDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
  }
}

export const EventModel = getModelForClass(EventDb);
