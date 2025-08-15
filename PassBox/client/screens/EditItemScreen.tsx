import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppStack'; // Assuming AppStack.tsx will define this
import { Ionicons } from '@expo/vector-icons';
import SecureTextBox from '../components/SecureTextBox';

type EditItemScreenProps = StackScreenProps<AppStackParamList, 'EditItem'>;

// Placeholder for VaultItem type (should be consistent with other screens)
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

const EditItemScreen: React.FC<EditItemScreenProps> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const isEditing = !!itemId;

  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // This will be the decrypted password
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const itemToEdit = DUMMY_VAULT_ITEMS.find((v) => v.id === itemId);
      if (itemToEdit) {
        setTitle(itemToEdit.title);
        setUsername(itemToEdit.username);
        // TODO: Decrypt password here
        setPassword(itemToEdit.encryptedPassword); // Placeholder
        setUrl(itemToEdit.url || '');
        setNotes(itemToEdit.notes || '');
      }
    }
  }, [itemId, isEditing]);

  const handleSave = () => {
    if (!title || !username || !password) {
      Alert.alert('Error', 'Title, Username, and Password are required.');
      return;
    }

    const newItem: VaultItem = {
      id: isEditing ? itemId! : String(Date.now()), // Simple ID generation for dummy data
      title,
      username,
      encryptedPassword: password, // TODO: Encrypt password here
      url: url || undefined,
      notes: notes || undefined,
      createdAt: isEditing ? DUMMY_VAULT_ITEMS.find(i => i.id === itemId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      // TODO: Implement update logic
      Alert.alert('Saved', `Item "${newItem.title}" updated.`);
    } else {
      // TODO: Implement create logic
      Alert.alert('Saved', `New item "${newItem.title}" created.`);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Item' : 'Add New Item'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Google, Bank Account"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., your.email@example.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <SecureTextBox
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />

        {/* TODO: Integrate Password Generator Drawer here */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., https://www.example.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="url"
            value={url}
            onChangeText={setUrl}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any additional notes"
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditItemScreen;