import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { PairDayDataModel, PairDayData } from '../../../models/dex/pairDayData';
import { PairHourDataDb, PairHourDataModel } from '../../../models/dex/pairHourData';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/dex/stableswapDayData';

@Service()
export class PairHourDataService {
  async getOrCreate(id: string) {
    let doc = await PairHourDataModel.findOne({id: id}).exec();
    if (doc === null) {
      let pairHourData = new PairHourDataDb(id);
      doc = new PairHourDataModel(pairHourData);
    }
    return doc;
  }

  async getById(id: string) {
    return await PairHourDataModel.findOne({id: id}).exec();
  }
}