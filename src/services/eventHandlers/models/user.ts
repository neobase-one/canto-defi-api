import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { LiquidityPosition, LiquidityPositionModel } from '../../../models/liquidityPosition';
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotModel } from '../../../models/liquidityPositionSnapshot';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/stableswapDayData';
import { User, UserModel } from '../../../models/user';

@Service()
export class UserService {
  async getOrCreate(id: string) {
    let doc = await UserModel.findOne({id: id}).exec();
    if (doc === null) {
      let user = new User(id);
      doc = new UserModel(user);
    }
    return doc;
  }

  async getById(id: string) {
    return await UserModel.findOne({id: id}).exec();
  }
}
