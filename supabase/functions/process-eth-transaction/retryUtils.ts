const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export async function retryWithBackoff(operation: () => Promise<any>, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}