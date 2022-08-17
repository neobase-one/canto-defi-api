import { Service } from 'typedi';
import { BurnDb, BurnModel } from '../../../models/dex/burn';

@Service()
export class BurnService {
  async getOrCreate(id: string) {
    let doc = await BurnModel.findOne({ id: id }).exec();
    if (doc === null) {
      let burn = new BurnDb(id);
      doc = new BurnModel(burn);
    }
    return doc;
  }

  async getById(id: string) {
    return await BurnModel.findOne({ id: id }).exec();
  }

  async save(burn: BurnDb) {
    let model = new BurnModel(burn);
    model.isNew = false;
    await model.save();
  }
}