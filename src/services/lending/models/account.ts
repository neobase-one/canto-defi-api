import { Service } from "typedi";
import { AccountDb, AccountModel } from "../../../models/lending/account";

@Service()
export class AccountService {
  async getById(id: string) {
    return await AccountModel.findOne({ id: id }).exec();
  }

  async save(bundle: AccountDb) {
    let model = new AccountModel(bundle);
    model.isNew = false;
    await model.save();
  }
}
