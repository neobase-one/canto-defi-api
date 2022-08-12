import { Service } from 'typedi';
import { TokenDb, TokenModel } from '../../../models/dex/token';

@Service()
export class TokenService {
  async getOrCreate(address: string) {
    let doc = await TokenModel.findOne({id: address}).exec();
    if (doc === null) {
      let token = new TokenDb(address);
      doc = new TokenModel(token);
    }
    return doc;
  }

  async getByAddress(address: string) {
    return await TokenModel.findOne({id: address}).exec();
  }
}