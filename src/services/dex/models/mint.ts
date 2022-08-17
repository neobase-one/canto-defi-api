import { Service } from 'typedi';
import { MintDb, MintModel } from '../../../models/dex/mint';

@Service()
export class MintService {
  async getOrCreate(id: string) {
    let doc = await MintModel.findOne({ id: id }).exec();
    if (doc === null) {
      let mint = new MintDb(id);
      doc = new MintModel(mint);
      await doc.save();
    }
    return doc as MintDb;
  }

  async getById(id: string) {
    return await MintModel.findOne({ id: id }).exec();
  }

  async deleteById(id: string) {
    return await MintModel.findOneAndDelete({ id: id }).exec();
  }

  async save(data: MintDb) {
    let model = new MintModel(data);
    model.isNew = false;
    await model.save();
  }
}