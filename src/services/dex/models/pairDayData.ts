import { Service } from 'typedi';
import { PairDayDataDb, PairDayDataModel } from '../../../models/dex/pairDayData';

@Service()
export class PairDayDataService {
  async getOrCreate(id: string) {
    let doc = await PairDayDataModel.findOne({ id: id }).exec();
    if (doc === null) {
      let pairDayData = new PairDayDataDb(id);
      doc = new PairDayDataModel(pairDayData);
      await doc.save();
    }
    return doc as PairDayDataDb;
  }

  async getById(id: string) {
    return await PairDayDataModel.findOne({ id: id }).exec();
  }

  async save(obj: PairDayDataDb) {
    let model = new PairDayDataModel(obj);
    model.isNew = false;
    await model.save();
  }
}