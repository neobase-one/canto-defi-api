import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { PairDayDataModel, PairDayData } from '../../../models/pairDayData';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/stableswapDayData';
import { TokenDayDataDb, TokenDayDataModel } from '../../../models/tokenDayData';

@Service()
export class TokenDayDataService {
  async getOrCreate(id: string) {
    let doc = await TokenDayDataModel.findOne({id: id}).exec();
    if (doc === null) {
      let tokenDayData = new TokenDayDataDb(id);
      doc = new TokenDayDataModel(tokenDayData);
    }
    return doc;
  }

  async getById(id: string) {
    return await TokenDayDataModel.findOne({id: id}).exec();
  }
}