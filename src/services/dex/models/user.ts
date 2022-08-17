import { Service } from 'typedi';
import { UserDb, UserModel } from '../../../models/dex/user';

@Service()
export class UserService {
  async getOrCreate(id: string) {
    let doc = await UserModel.findOne({ id: id }).exec();
    if (doc === null) {
      let user = new UserDb(id);
      doc = new UserModel(user);
    }
    return doc;
  }

  async getById(id: string) {
    return await UserModel.findOne({ id: id }).exec();
  }
}
