import { Service } from 'typedi';
import { MarketModel } from '../../../models/lending/market';

@Service()
export class MarketService {
  async getByAddress(address: string) {
    return await MarketModel.findOne({address: address}).exec();
  }
}