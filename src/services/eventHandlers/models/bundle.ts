import { Service } from 'typedi';
import { BundleModel } from '../../../models/bundle';

@Service()
export class BundleService {

  async get() {
    return await BundleModel.findOne({id: 1}).exec();
  }
}