import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppStack';
import { Ionicons } from '@expo/vector-icons';
import SecureTextBox from '../components/SecureTextBox';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

type ItemDetailScreenProps = StackScreenProps<AppStackParamList, 'ItemDetail'>;

// Placeholder for VaultItem type (should be consistent with VaultListScreen)
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

// Dummy data for now (replace with actual data fetching)
const DUMMY_VAULT_ITEMS: VaultItem[] = [
  {
    id: '1',
    title: 'Google',
    username: 'user@gmail.com',
    encryptedPassword: 'encrypted_password_1',
    url: 'https://google.com',
    notes: 'This is a note for Google.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Facebook',
    username: 'user@facebook.com',
    encryptedPassword: 'encrypted_password_2',
    url: 'https://facebook.com',
    notes: 'This is a note for Facebook.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const item = DUMMY_VAULT_ITEMS.find((v) => v.id === itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vault item not found.</Text>
      </View>
    );
  }

  const handleCopy = async (text: string, fieldName: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Toast.show({
      type: 'success',
      text1: `${fieldName} copied!`,
      visibilityTime: 2000,
      autoHide: true,
    });

    // Clear clipboard after 30 seconds
    setTimeout(() => {
      Clipboard.setStringAsync('');
      console.log('Clipboard cleared.');
    }, 30000);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual delete logic
            Alert.alert('Deleted', `${item.title} has been deleted.`);
            navigation.goBack(); // Go back to list after deletion
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditItem', { itemId: item.id })}>
          <Ionicons name="create-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.valueWithCopy}>
            <Text style={styles.valueText}>{item.username}</Text>
            <TouchableOpacity onPress={() => handleCopy(item.username, 'Username')}>
              <Ionicons name="copy" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.valueWithCopy}>
            {/* Using SecureTextBox for display, but it's not editable here */}
            <SecureTextBox
              label="" // Label is handled by parent View
              placeholder="Encrypted Password"
              value={item.encryptedPassword} // This will be the decrypted password in real implementation
              onChangeText={() => {}} // Not editable
              keyboardType="default"
            />
            <TouchableOpacity onPress={() => handleCopy(item.encryptedPassword, 'Password')}>
              <Ionicons name="copy" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>

        {item.url && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>URL</Text>
            <View style={styles.valueWithCopy}>
              <Text style={styles.valueText}>{item.url}</Text>
              <TouchableOpacity onPress={() => handleCopy(item.url!, 'URL')}>
                <Ionicons name="copy" size={20} color="#007bff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {item.notes && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.valueText}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Created At</Text>
          <Text style={styles.valueText}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Updated At</Text>
          <Text style={styles.valueText}>{new Date(item.updatedAt).toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Item</Text>
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  valueWithCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
  },
  valueText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1, // Allow text to shrink
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red for delete
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});

export default ItemDetailScreen;