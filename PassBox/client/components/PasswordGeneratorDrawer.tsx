import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Slider } from 'react-native';
import { generatePassword } from '../utils/passwordGenerator';
import { Ionicons } from '@expo/vector-icons';

interface PasswordGeneratorDrawerProps {
  onGenerate: (password: string) => void;
  onClose: () => void;
}

const PasswordGeneratorDrawer: React.FC<PasswordGeneratorDrawerProps> = ({ onGenerate, onClose }) => {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword({
        length,
        includeSymbols,
        includeNumbers,
        includeUppercase,
        includeLowercase,
      });
      setGeneratedPassword(newPassword);
      onGenerate(newPassword);
    } catch (error: any) {
      console.error('Error generating password:', error.message);
      setGeneratedPassword('Error generating password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Password Generator</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Length: {length}</Text>
        <Slider
          style={styles.slider}
          minimumValue={8}
          maximumValue={64}
          step={1}
          value={length}
          onValueChange={setLength}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#007bff"
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Include Symbols</Text>
        <Switch
          value={includeSymbols}
          onValueChange={setIncludeSymbols}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={includeSymbols ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Include Numbers</Text>
        <Switch
          value={includeNumbers}
          onValueChange={setIncludeNumbers}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={includeNumbers ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Include Uppercase</Text>
        <Switch
          value={includeUppercase}
          onValueChange={setIncludeUppercase}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={includeUppercase ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Include Lowercase</Text>
        <Switch
          value={includeLowercase}
          onValueChange={setIncludeLowercase}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={includeLowercase ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Generate Password</Text>
      </TouchableOpacity>

      {generatedPassword ? (
        <View style={styles.generatedPasswordContainer}>
          <Text style={styles.generatedPasswordLabel}>Generated Password:</Text>
          <Text style={styles.generatedPasswordText}>{generatedPassword}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222', // Dark background for the drawer
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    fontSize: 16,
    color: '#fff',
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  generateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  generatedPasswordContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  generatedPasswordLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  generatedPasswordText: {
    color: '#00ff00', // Green for generated password
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordGeneratorDrawer;