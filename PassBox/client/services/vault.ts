import { supabase } from './supabase';
import { encrypt, decrypt, generateSalt } from './crypto';
import { Buffer } from 'buffer';

// Define the structure of a vault item as it will be stored in the database
export interface VaultItemDB {
  id?: number; // Supabase will auto-generate for new items
  user_id?: string; // Supabase RLS will handle this
  title: string;
  username: string;
  ciphertext: string; // Base64 encoded Uint8Array
  iv: string; // Base64 encoded Uint8Array
  salt: string; // Base64 encoded Uint8Array
  url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the structure of a vault item as it will be used in the application (decrypted)
export interface VaultItemApp {
  id?: number;
  title: string;
  username: string;
  password: string; // Decrypted password
  url?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create a new vault item
export const createVaultItem = async (
  item: Omit<VaultItemApp, 'id' | 'createdAt' | 'updatedAt'>,
  masterKey: Uint8Array,
): Promise<VaultItemDB> => {
  const salt = await generateSalt();
  const { ciphertext: encryptedPasswordBuffer, iv: ivBuffer } = await encrypt(
    item.password,
    masterKey,
  );

  const { data, error } = await supabase
    .from('vault_items')
    .insert({
      title: item.title,
      username: item.username,
      ciphertext: Buffer.from(encryptedPasswordBuffer).toString('base64'),
      iv: Buffer.from(ivBuffer).toString('base64'),
      salt: Buffer.from(salt).toString('base64'),
      url: item.url,
      notes: item.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Read vault items for the current user
export const getVaultItems = async (masterKey: Uint8Array): Promise<VaultItemApp[]> => {
  const { data, error } = await supabase.from('vault_items').select('*');

  if (error) throw error;

  const decryptedItems: VaultItemApp[] = await Promise.all(
    data.map(async (item: VaultItemDB) => {
      const decryptedPassword = await decrypt(
        Buffer.from(item.ciphertext, 'base64'),
        Buffer.from(item.iv, 'base64'),
        masterKey,
      );
      return {
        id: item.id,
        title: item.title,
        username: item.username,
        password: decryptedPassword,
        url: item.url,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    }),
  );
  return decryptedItems;
};

// Update a vault item
export const updateVaultItem = async (
  id: number,
  item: Omit<VaultItemApp, 'id' | 'createdAt' | 'updatedAt'>,
  masterKey: Uint8Array,
): Promise<VaultItemDB> => {
  const salt = await generateSalt(); // Generate new salt on update
  const { ciphertext: encryptedPasswordBuffer, iv: ivBuffer } = await encrypt(
    item.password,
    masterKey,
  );

  const { data, error } = await supabase
    .from('vault_items')
    .update({
      title: item.title,
      username: item.username,
      ciphertext: Buffer.from(encryptedPasswordBuffer).toString('base64'),
      iv: Buffer.from(ivBuffer).toString('base64'),
      salt: Buffer.from(salt).toString('base64'),
      url: item.url,
      notes: item.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a vault item
export const deleteVaultItem = async (id: number): Promise<void> => {
  const { error } = await supabase.from('vault_items').delete().eq('id', id);
  if (error) throw error;
};