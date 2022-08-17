import { Service } from 'typedi';
import { StableswapDayDataDb, StableswapDayDataModel } from '../../../models/dex/stableswapDayData';

@Service()
export class FactoryDayDataService {
  async getOrCreate(id: string) {
    let doc = await StableswapDayDataModel.findOne({ id: id }).exec();
    if (doc === null) {
      let stableswapDayData = new StableswapDayDataDb(id);
      doc = new StableswapDayDataModel(stableswapDayData);
    }
    return doc;
  }

  async getById(id: string) {
    return await StableswapDayDataModel.findOne({ id: id }).exec();
  }

  async save(data: StableswapDayDataDb) {
    let model = new StableswapDayDataModel(data);
    model.isNew = false;
    await model.save();
  }
}