import { Service } from 'typedi';
import { MarketModel } from '../../../models/lending/market';

@Service()
export class MarketService {

  async get() {
    return await MarketModel.findOne({id: 1}).exec();
  }
}