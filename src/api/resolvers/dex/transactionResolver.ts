import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Transaction, TransactionDb, TransactionModel } from "../../../models/dex/transaction";
import { OrderDirection, TransactionInput, TransactionsInput } from "../inputs/queryInputs";

@Resolver()
export class TransactionsResolver {
    @Query(returns => Transaction)
    async transaction(@Arg("input") input: TransactionInput) {
        const val = await TransactionModel.findOne({ id: input.id }).exec();
        return val?.toGenerated();
    }

    @Query(returns => [Transaction])
    async transactions(@Arg("input") input: TransactionsInput) {
        if (!isNullOrUndefined(input.id)) {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await TransactionModel.find({ id: input.id }).sort(sortBy).exec();
            const result = await this.toGenerated(val as unknown as [TransactionDb]);
            return result;
        } else {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await TransactionModel.find().sort(sortBy).limit(input.first).exec();
            const result = await this.toGenerated(val as unknown as [TransactionDb]);
            return result;
        }
    }

    async toGenerated(transactions: [TransactionDb]): Promise<Transaction[]> {
        var result: Transaction[]=[];
        for (var transactionDb of transactions) {
            let transaction = await transactionDb.toGenerated();
            result.push(transaction);
          }
        return result;
    }
}