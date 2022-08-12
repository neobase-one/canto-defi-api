import { Service } from 'typedi';
import { AccountModel } from '../../../models/lending/account';

@Service()
export class AccountService {
    async getById(id: string) {
        return await AccountModel.findOne({ id: id }).exec();
    }
}