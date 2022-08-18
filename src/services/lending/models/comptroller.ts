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

  async save(bundle: ComptrollerDb) {
    let model = new ComptrollerModel(bundle);
    model.isNew = false;
    await model.save();
  }
}
