import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { StableswapDayDataDb, StableswapDayDataModel } from '../../../models/stableswapDayData';

@Service()
export class FactoryDayDataService {
  async getOrCreate(id: string) {
    let doc = await StableswapDayDataModel.findOne({id: id}).exec();
    if (doc === null) {
      let stableswapDayData = new StableswapDayDataDb(id);
      doc = new StableswapDayDataModel(stableswapDayData);
    }
    return doc;
  }

  async getById(id: string) {
    return await StableswapDayDataModel.findOne({id: id}).exec();
  }
}