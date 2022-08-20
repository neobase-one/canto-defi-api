import { Service } from "typedi";
import { AccountDb, AccountModel } from "../../../models/lending/account";

@Service()
export class AccountService {
  async getById(id: string) {
    return await AccountModel.findOne({ id: id }).exec();
  }

  async save(account: AccountDb) {
    // let accountdb = await AccountModel.findOne({ id: account.id }).exec();
    // let model = new AccountModel(account);
    // if (accountdb !== null) {
    //   model._id = accountdb._id;
    //   delete model.__v;
    //   model.isNew = false;
    //   await model.save();
    // } else {
    //   await model.save();
    // }
    var doc = AccountModel.hydrate(account);
    doc = doc.toObject();
    delete doc._id;
    // console.log(doc, account)
    await AccountModel.updateOne({id: account.id}, doc, {upsert: true}).exec();
  }
}
