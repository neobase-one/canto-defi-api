import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { Burn, BurnModel } from '../../../models/burn';

@Service()
export class BurnService {
  async getOrCreate(id: string) {
    let doc = await BurnModel.findOne({id: id}).exec();
    if (doc === null) {
      let burn = new Burn();
      burn.justId(id);
      doc = new BurnModel(burn);
    }
    return doc;
  }

  async getById(id: string) {
    return await BurnModel.findOne({id: id}).exec();
  }
}