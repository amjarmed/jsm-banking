import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import {transactionCategoryStyles} from '../../constants';
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from '../../lib/utils';
function TransactionsTable({transactions}: TransactionTableProps) {
  const CategoryBadge = ({category}: CategoryBadgeProps) => {
    const {borderColor, backgroundColor, textColor, chipBackgroundColor} =
      transactionCategoryStyles[
        category as keyof typeof transactionCategoryStyles
      ] || transactionCategoryStyles.default;

    return (
      <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
        <div className={cn('size-2 rounded-full', backgroundColor)} />
        <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
      </div>
    );
  };

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transactions</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2 max-md:hidden">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === 'debit';
          const isCredit = t.type === 'credit';

          return (
            <TableRow
              key={t.id}
              className={
                isDebit || amount[0] === '-'
                  ? 'bg-[#fffbfa]'
                  : `bg-[#f6fef9] !over:bg-none`
              }
            >
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  {t.image != null ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full border bg-[#e5e7eb] "></div>
                  )}
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>
              <TableCell
                className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              <TableCell className="pl-2 pr-10 min-w-32">
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {t.paymentChannel}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={t.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default TransactionsTable;
