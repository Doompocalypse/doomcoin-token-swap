const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateAlphanumericId = (length: number = 2): string => {
  const number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const letter = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  return `${number}${letter}`;
};

export const formatTokenId = (id: string | number): string => {
  // Check if it's already in the correct format (2 numbers + 1 letter)
  if (typeof id === 'string' && /^\d{2}[A-Z]$/.test(id)) {
    return id;
  }
  // For backward compatibility with numeric IDs
  return id.toString().padStart(2, '0') + 'A';
};