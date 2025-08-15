import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import argon2 from 'argon2';

// Generate a random salt for Argon2id
export const generateSalt = async (): Promise<Uint8Array> => {
  const salt = Crypto.getRandomBytes(16); // 16 bytes = 128 bits
  return salt;
};

// Derive a 256-bit AES-GCM key from the master password using Argon2id
export const deriveKey = async (
  masterPassword: string,
  salt: Uint8Array,
): Promise<Uint8Array> => {
  // Argon2id parameters:
  // timeCost (t): 3 (iterations)
  // memoryCost (m): 2^16 (65536) = 64 MB
  // parallelism (p): 1
  // keyLength (dkLen): 32 bytes = 256 bits
  // type: argon2.argon2id
  const derivedKey = await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt: Buffer.from(salt), // Convert Uint8Array to Buffer
    timeCost: 3,
    memoryCost: 1 << 16, // 2^16 = 65536
    parallelism: 1,
    hashLength: 32, // 32 bytes = 256 bits
    raw: true, // Return raw bytes
  });
  return derivedKey as Uint8Array;
};

// Encrypt data using AES-GCM
export const encrypt = async (
  data: string,
  key: Uint8Array,
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> => {
  const iv = Crypto.getRandomBytes(12); // 12 bytes = 96 bits for AES-GCM IV
  const algorithm = {
    name: 'AES-GCM',
    iv: iv,
    tagLength: 128, // The GCM authentication tag length in bits
  };
  const cryptoKey = await Crypto.webcrypto.subtle.importKey(
    'raw',
    key,
    algorithm,
    false,
    ['encrypt']
  );

  const encoded = new TextEncoder().encode(data);
  const ciphertextWithTag = await Crypto.webcrypto.subtle.encrypt(
    algorithm,
    cryptoKey,
    encoded
  );

  // The encrypted data (ciphertextWithTag) contains both the ciphertext and the authentication tag.
  // For AES-GCM, the tag is appended to the ciphertext.
  // We need to separate them. The tagLength is 128 bits = 16 bytes.
  const tagLengthBytes = algorithm.tagLength / 8;
  const ciphertext = new Uint8Array(ciphertextWithTag.slice(0, ciphertextWithTag.byteLength - tagLengthBytes));
  const tag = new Uint8Array(ciphertextWithTag.slice(ciphertextWithTag.byteLength - tagLengthBytes));

  // For Supabase, we store ciphertext, IV, and salt separately.
  // The tag needs to be stored as part of the ciphertext for decryption.
  // So, we'll return the full ciphertextWithTag as ciphertext and the IV.
  return { ciphertext: new Uint8Array(ciphertextWithTag), iv };
};

// Decrypt data using AES-GCM
export const decrypt = async (
  ciphertextWithTag: Uint8Array,
  iv: Uint8Array,
  key: Uint8Array,
): Promise<string> => {
  const algorithm = {
    name: 'AES-GCM',
    iv: iv,
    tagLength: 128,
  };
  const cryptoKey = await Crypto.webcrypto.subtle.importKey(
    'raw',
    key,
    algorithm,
    false,
    ['decrypt']
  );

  const decrypted = await Crypto.webcrypto.subtle.decrypt(
    algorithm,
    cryptoKey,
    ciphertextWithTag
  );

  return new TextDecoder().decode(decrypted);
};

import * as SecureStore from 'expo-secure-store';

const MASTER_KEY_STORAGE_KEY = 'passbox_master_key';

export const saveMasterKey = async (key: Uint8Array): Promise<void> => {
  try {
    await SecureStore.setItemAsync(MASTER_KEY_STORAGE_KEY, Buffer.from(key).toString('base64'));
  } catch (error) {
    console.error('Error saving master key to SecureStore:', error);
    throw error;
  }
};

export const getMasterKey = async (): Promise<Uint8Array | null> => {
  try {
    const keyBase64 = await SecureStore.getItemAsync(MASTER_KEY_STORAGE_KEY);
    if (keyBase64) {
      return Buffer.from(keyBase64, 'base64');
    }
    return null;
  } catch (error) {
    console.error('Error retrieving master key from SecureStore:', error);
    throw error;
  }
};

export const deleteMasterKey = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(MASTER_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error deleting master key from SecureStore:', error);
    throw error;
  }
};

export const reEncryptAllVaultItems = async (
  oldMasterKey: Uint8Array,
  newMasterKey: Uint8Array,
  vaultItems: any[], // TODO: Define proper type for vault items
): Promise<void> => {
  // This is a placeholder. Actual implementation will involve:
  // 1. Iterating through vaultItems
  // 2. Decrypting each item with oldMasterKey
  // 3. Generating new salt and IV for each item
  // 4. Encrypting each item with newMasterKey
  // 5. Updating the item in Supabase with newCiphertext, newIv, and newSalt
  console.log('Re-encrypting all vault items...');
  // Example:
  // for (const item of vaultItems) {
  //   const decryptedPassword = await decrypt(item.ciphertext, item.iv, oldMasterKey);
  //   const newSalt = await generateSalt();
  //   const { ciphertext: newCiphertext, iv: newIv } = await encrypt(decryptedPassword, newMasterKey);
  //   // Update item in Supabase with newCiphertext, newIv, newSalt
  // }
};