import { Service } from "typedi";
import {
  AccountCTokenDb,
  AccountCTokenModel,
} from "../../../models/lending/accountCToken";

@Service()
export class AccountCTokenService {
  async getById(id: string) {
    return await AccountCTokenModel.findOne({ id: id }).exec();
  }

  async save(bundle: AccountCTokenDb) {
    let model = new AccountCTokenModel(bundle);
    model.isNew = false;
    await model.save();
  }
}
