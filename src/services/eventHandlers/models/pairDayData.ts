import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { PairDayDataModel, PairDayData } from '../../../models/pairDayData';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/stableswapDayData';

@Service()
export class PairDayDataService {
  async getOrCreate(id: string) {
    let doc = await PairDayDataModel.findOne({id: id}).exec();
    if (doc === null) {
      let pairDayData = new PairDayData(id);
      doc = new PairDayDataModel(pairDayData);
    }
    return doc;
  }

  async getById(id: string) {
    return await PairDayDataModel.findOne({id: id}).exec();
  }
}