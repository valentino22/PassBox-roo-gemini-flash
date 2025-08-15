import * as Crypto from 'expo-crypto';

interface PasswordOptions {
  length: number;
  includeSymbols: boolean;
  includeNumbers: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
}

const SYMBOLS = '!@#$%^&*()-_+=[]{}|;:,.<>?';
const NUMBERS = '0123456789';
const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export const generatePassword = (options: PasswordOptions): string => {
  const { length, includeSymbols, includeNumbers, includeUppercase, includeLowercase } = options;

  let characters = '';
  if (includeSymbols) characters += SYMBOLS;
  if (includeNumbers) characters += NUMBERS;
  if (includeUppercase) characters += UPPERCASE_LETTERS;
  if (includeLowercase) characters += LOWERCASE_LETTERS;

  if (characters.length === 0) {
    throw new Error('At least one character type must be selected for password generation.');
  }

  let password = '';
  const charactersLength = characters.length;
  const randomBytes = Crypto.getRandomBytes(length); // Get enough random bytes for the password length

  for (let i = 0; i < length; i++) {
    // Use modulo to map random byte to character index
    const randomIndex = randomBytes[i] % charactersLength;
    password += characters.charAt(randomIndex);
  }

  // Ensure at least one character from each selected category is present
  // This prevents cases where, due to randomness, a selected category might be missed
  if (includeSymbols && !/[!@#$%^&*()-_+=[]{}\|;:,.<>?]/.test(password)) {
    const randomIndex = Crypto.getRandomBytes(1)[0] % SYMBOLS.length;
    password = replaceRandomChar(password, SYMBOLS.charAt(randomIndex));
  }
  if (includeNumbers && !/[0-9]/.test(password)) {
    const randomIndex = Crypto.getRandomBytes(1)[0] % NUMBERS.length;
    password = replaceRandomChar(password, NUMBERS.charAt(randomIndex));
  }
  if (includeUppercase && !/[A-Z]/.test(password)) {
    const randomIndex = Crypto.getRandomBytes(1)[0] % UPPERCASE_LETTERS.length;
    password = replaceRandomChar(password, UPPERCASE_LETTERS.charAt(randomIndex));
  }
  if (includeLowercase && !/[a-z]/.test(password)) {
    const randomIndex = Crypto.getRandomBytes(1)[0] % LOWERCASE_LETTERS.length;
    password = replaceRandomChar(password, LOWERCASE_LETTERS.charAt(randomIndex));
  }

  return shuffleString(password);
};

// Helper to replace a random character in a string
const replaceRandomChar = (str: string, char: string): string => {
  const index = Crypto.getRandomBytes(1)[0] % str.length;
  return str.substring(0, index) + char + str.substring(index + 1);
};

// Helper to shuffle a string (Fisher-Yates algorithm)
const shuffleString = (str: string): string => {
  const a = str.split('');
  for (let i = a.length - 1; i > 0; i--) {
    const j = Crypto.getRandomBytes(1)[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};