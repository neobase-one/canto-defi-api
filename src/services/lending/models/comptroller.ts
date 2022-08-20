import { Service } from "typedi";
import {
  ComptrollerDb,
  ComptrollerModel,
} from "../../../models/lending/comptroller";

@Service()
export class ComptrollerService {
  async getById(id: string) {
    return await ComptrollerModel.findOne({ id: id }).exec();
  }

  async save(comptroller: ComptrollerDb) {
    // let comptrollerdb = await ComptrollerModel.findOne({ id: comptroller.id }).exec();
    // let model = new ComptrollerModel(comptroller);
    // if (comptrollerdb !== null) {
    //   model._id = comptrollerdb._id;
    //   delete model.__v;
    //   model.isNew = false;
    //   await model.save();
    // } else {
    //   await model.save();
    // }
    var doc = ComptrollerModel.hydrate(comptroller);
    doc = doc.toObject();
    delete doc._id;
    // console.log(doc, comptroller)
    await ComptrollerModel.updateOne({id: comptroller.id}, doc, {upsert: true}).exec();
  }
}
