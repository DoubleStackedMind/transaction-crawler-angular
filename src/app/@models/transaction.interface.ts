export interface ITransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  value: string;
  to: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}
