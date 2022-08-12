import { Service } from 'typedi';
import { EventData } from 'web3-eth-contract';
import { LiquidityPosition, LiquidityPositionModel } from '../../../models/dex/liquidityPosition';
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotModel } from '../../../models/dex/liquidityPositionSnapshot';
import { StableswapDayData, StableswapDayDataModel } from '../../../models/dex/stableswapDayData';
import { UserDb, UserModel } from '../../../models/dex/user';

@Service()
export class UserService {
  async getOrCreate(id: string) {
    let doc = await UserModel.findOne({id: id}).exec();
    if (doc === null) {
      let user = new UserDb(id);
      doc = new UserModel(user);
    }
    return doc;
  }

  async getById(id: string) {
    return await UserModel.findOne({id: id}).exec();
  }
}
