import { Service } from 'typedi';
import { TokenDayDataDb, TokenDayDataModel } from '../../../models/dex/tokenDayData';

@Service()
export class TokenDayDataService {
  async getOrCreate(id: string) {
    let doc = await TokenDayDataModel.findOne({ id: id }).exec();
    if (doc === null) {
      let tokenDayData = new TokenDayDataDb(id);
      doc = new TokenDayDataModel(tokenDayData);
      await doc.save();
    }
    return doc as TokenDayDataDb;
  }

  async getById(id: string) {
    return await TokenDayDataModel.findOne({ id: id }).exec();
  }

  async save(obj: TokenDayDataDb) {
    let model = new TokenDayDataModel(obj);
    model.isNew = false;
    await model.save();
  }
}