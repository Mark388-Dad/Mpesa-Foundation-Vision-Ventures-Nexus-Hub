
/**
 * Validates if email belongs to Mpesa Foundation Academy
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidAcademyEmail = (email: string): boolean => {
  return email.endsWith('@mpesafoundationacademy.ac.ke');
};

/**
 * Formats price for display
 * @param price Price as number
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(price);
};

/**
 * Generates a random pick-up code
 * @returns Random alphanumeric code
 */
export const generatePickupCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Truncates text to a specified length
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, length: number = 50): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Creates a proper date format for display
 * @param dateString Date string
 * @returns Formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
