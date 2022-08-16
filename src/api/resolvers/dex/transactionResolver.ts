import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Burn, BurnModel } from "../../../models/dex/burn";
import { Mint, MintModel } from "../../../models/dex/mint";
import { Swap, SwapModel } from "../../../models/dex/swap";
import { Transaction, TransactionDb, TransactionModel } from "../../../models/dex/transaction";
import { OrderDirection, TransactionInput, TransactionsInput } from "../inputs/queryInputs";

@Resolver(Transaction)
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
        var result: Transaction[] = [];
        for (var transactionDb of transactions) {
            let transaction = await transactionDb.toGenerated();
            result.push(transaction);
        }
        return result;
    }

    @FieldResolver()
    async mints(@Root() transaction: Transaction) {
        const transactionDb = await TransactionModel.findOne({ id: transaction.id });
        const t = transactionDb as unknown as TransactionDb;
        if (t.mints !== []) {
            const mintDbs = await MintModel.find({ id: t.mints });
            let mints: Mint[] = [];
            for (var mintDb of mintDbs) {
                let mint = await mintDb.toGenerated();
                mints.push(mint);
            }
            return mints;
        }
    }
    @FieldResolver()
    async burns(@Root() transaction: Transaction) {
        const transactionDb = await TransactionModel.findOne({ id: transaction.id });
        const t = transactionDb as unknown as TransactionDb;
        if (t.burns !== []) {
            const burnDbs = await BurnModel.find({ id: t.burns });
            let burns: Burn[] = [];
            for (var burnDb of burnDbs) {
                let burn = await burnDb.toGenerated();
                burns.push(burn);
            }
            return burns;
        }
    }
    @FieldResolver()
    async swaps(@Root() transaction: Transaction) {
        const transactionDb = await TransactionModel.findOne({ id: transaction.id });
        const t = transactionDb as unknown as TransactionDb;
        if (t.swaps !== []) {
            const swapDbs = await SwapModel.find({ id: t.swaps });
            let swaps: Swap[] = [];
            for (var swapDb of swapDbs) {
                let swap = await swapDb.toGenerated();
                swaps.push(swap);
            }
            return swaps;
        }
    }
}