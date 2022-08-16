import Decimal from 'decimal.js';
import { Service } from 'typedi';
import { Config } from '../../../config';
import { web3 } from '../../../loaders/web3';
import { MarketModel } from '../../../models/lending/market';
import { cTokenABI } from '../../../utils/abiParser/ctoken';
import { DAYS_IN_YEAR, DAYS_IN_YEAR_DB, HUNDRED_DB, NEG_ONE_DB, ONE_BD, SECONDS_IN_DAY, SECONDS_IN_DAY_BD } from '../../../utils/constants';
import { convertToDecimal, exponentToBigDecimal } from '../../../utils/helper';

@Service()
export class MarketService {
  async getByAddress(address: string) {
    return await MarketModel.findOne({address: address}).exec();
  }

  async getSupplyAPY(marketId: string) {
    return this.getAPY(marketId, true);
  }

  async getBorrowAPY(marketId: string) {
    return this.getAPY(marketId, false);
  }

  async getAPY(marketId: string, supply: boolean) {
    if (marketId === null) {
      return NEG_ONE_DB;
    }
    // if supply = true => supplyAPY
    // if supply = false => borrowAPY

    const contract = await new web3.eth.Contract(cTokenABI, marketId);

    // rate per block
    let ratePerBlock;
    if (supply) {
      ratePerBlock = await contract.methods.supplyRatePerBlock().call();
    } else {
      ratePerBlock = await contract.methods.borrowRatePerBlock().call();
    }


    // Big Decimal
    // todo: verify formula
    let mantissa_factor = Config.canto.lendingDashboard.MANTISSA_FACTOR;
    let block_time = convertToDecimal(Config.canto.BLOCK_TIME);
    let blocksPerDay = SECONDS_IN_DAY_BD.div(block_time);
    let mantissa = exponentToBigDecimal(mantissa_factor);
    let denom = mantissa;
    // let denom = mantissa.times(blockPerDay);
    let frac = convertToDecimal(ratePerBlock).times(blocksPerDay).div(denom);
    let a = frac.plus(ONE_BD);
    let b = a.pow(DAYS_IN_YEAR_DB)
    let c = b.minus(ONE_BD);

    // calculate apy
    let apy = c.times(HUNDRED_DB);

    // // Math
    // let bpd = Math.floor(SECONDS_IN_DAY / Config.canto.BLOCK_TIME)
    // let ethMantissa = 1e18;
    // let dpy = DAYS_IN_YEAR;
    // console.log(ratePerBlock, bpd, ethMantissa, dpy)
    // let apy = (((Math.pow((ratePerBlock / ethMantissa * bpd) + 1, dpy))) - 1) * 100;

    //
    return apy;
  }
}