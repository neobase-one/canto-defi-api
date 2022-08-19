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

  async save(accountCToken: AccountCTokenDb) {
    let actokendb = await AccountCTokenModel.findOne({ id: accountCToken.id }).exec();
    let model = new AccountCTokenModel(accountCToken);
    if (actokendb !== null) {
      model._id = actokendb._id;
      delete model.__v;
      model.isNew = false;
      await model.save();
    } else {
      await model.save();
    }
    
  }
}
