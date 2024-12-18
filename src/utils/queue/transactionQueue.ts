type TransactionFunction = () => Promise<any>;

let isProcessing = false;
const transactionQueue: Array<TransactionFunction> = [];

const processQueue = async () => {
  if (isProcessing || transactionQueue.length === 0) return;
  
  isProcessing = true;
  console.log("Processing next transaction in queue...");
  
  try {
    const nextTransaction = transactionQueue.shift();
    if (nextTransaction) {
      await nextTransaction();
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
  } finally {
    isProcessing = false;
    if (transactionQueue.length > 0) {
      await processQueue();
    }
  }
};

export const queueTransaction = async (transactionFn: TransactionFunction) => {
  return new Promise((resolve, reject) => {
    transactionQueue.push(async () => {
      try {
        const result = await transactionFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};