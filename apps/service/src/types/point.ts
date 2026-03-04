export interface Point {
  transactionId: number;
  amount: number;
  type: 'AD_REWARD' | 'COST';
  balanceAfterTransaction: number;
  createdAt: string;
}
