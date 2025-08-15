import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppStack'; // Assuming AppStack.tsx will define this
import { useDebounce } from '../hooks/useDebounce';

type VaultListScreenProps = StackScreenProps<AppStackParamList, 'VaultList'>;

// Placeholder for VaultItem type
interface VaultItem {
  id: string;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dummy data for now
const DUMMY_VAULT_ITEMS: VaultItem[] = [
  {
    id: '1',
    title: 'Google',
    username: 'user@gmail.com',
    encryptedPassword: 'encrypted_password_1',
    url: 'https://google.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Facebook',
    username: 'user@facebook.com',
    encryptedPassword: 'encrypted_password_2',
    url: 'https://facebook.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Amazon',
    username: 'user@amazon.com',
    encryptedPassword: 'encrypted_password_3',
    url: 'https://amazon.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Netflix',
    username: 'user@netflix.com',
    encryptedPassword: 'encrypted_password_4',
    url: 'https://netflix.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Microsoft',
    username: 'user@microsoft.com',
    encryptedPassword: 'encrypted_password_5',
    url: 'https://microsoft.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const VaultListScreen: React.FC<VaultListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to descending for updatedAt
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const sortedAndFilteredItems = useMemo(() => {
    let items = DUMMY_VAULT_ITEMS;

    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerCaseQuery) ||
          item.username.toLowerCase().includes(lowerCaseQuery) ||
          (item.url && item.url.toLowerCase().includes(lowerCaseQuery)),
      );
    }

    return items.sort((a, b) => {
      let compareValue = 0;
      if (sortBy === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else if (sortBy === 'updatedAt') {
        compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }, [debouncedSearchQuery, sortBy, sortOrder]);

  const renderItem = ({ item }: { item: VaultItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemUsername}>{item.username}</Text>
      <View style={styles.copyIcons}>
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="copy" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="eye" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vault</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EditItem', { itemId: undefined })}>
          <Ionicons name="add-circle" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search vault items..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'title' && styles.activeSortButton]}
          onPress={() => {
            if (sortBy === 'title') {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortBy('title');
              setSortOrder('asc');
            }
          }}
        >
          <Text style={styles.sortButtonText}>Title {sortBy === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'updatedAt' && styles.activeSortButton]}
          onPress={() => {
            if (sortBy === 'updatedAt') {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortBy('updatedAt');
              setSortOrder('desc'); // Default to desc for updatedAt
            }
          }}
        >
          <Text style={styles.sortButtonText}>Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '▲' : '▼')}</Text>
        </TouchableOpacity>
      </View>
      <FlashList
        data={sortedAndFilteredItems}
        renderItem={renderItem}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 5,
  },
  searchBar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sortLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  activeSortButton: {
    backgroundColor: '#007bff',
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemUsername: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  copyIcons: {
    flexDirection: 'row',
  },
  copyButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default VaultListScreen;