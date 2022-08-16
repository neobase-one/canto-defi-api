import { Service } from 'typedi';
import { AccountCTokenModel } from '../../../models/lending/accountCToken';

@Service()
export class AccountCTokenService {
    async getById(id: string) {
        return await AccountCTokenModel.findOne({ id: id }).exec();
    }
}