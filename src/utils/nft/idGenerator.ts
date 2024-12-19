const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateAlphanumericId = (length: number = 6): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
};

export const formatTokenId = (id: string | number): string => {
  if (typeof id === 'string' && /^[A-Z0-9]{6}$/.test(id)) {
    return id;
  }
  // For backward compatibility with numeric IDs
  return id.toString().padStart(6, '0');
};