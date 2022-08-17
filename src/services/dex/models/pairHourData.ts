import { Service } from 'typedi';
import { PairHourDataDb, PairHourDataModel } from '../../../models/dex/pairHourData';

@Service()
export class PairHourDataService {
  async getOrCreate(id: string) {
    let doc = await PairHourDataModel.findOne({ id: id }).exec();
    if (doc === null) {
      let pairHourData = new PairHourDataDb(id);
      doc = new PairHourDataModel(pairHourData);
    }
    return doc;
  }

  async getById(id: string) {
    return await PairHourDataModel.findOne({ id: id }).exec();
  }
}