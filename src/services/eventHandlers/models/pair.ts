import { Service } from 'typedi';
import { Pair, PairModel } from '../../../models/pair';

@Service()
export class PairService {
  async getOrCreate(address: string) {
    let doc = await PairModel.findOne({id: address}).exec();
    if (doc === null) {
      let obj = new Pair(address);
      doc = new PairModel(obj);
    }
    return doc;
  }

  async getByAddress(address: string) {
    return await PairModel.findOne({id: address}).exec();
  }
}