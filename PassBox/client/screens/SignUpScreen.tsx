import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import SecureTextBox from '../components/SecureTextBox';
import { Ionicons } from '@expo/vector-icons';

type SignUpScreenProps = StackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // TODO: Implement actual password strength calculation
  const passwordStrength = 'Weak'; // Placeholder

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    // TODO: Implement Supabase sign-up logic here
    Alert.alert('Sign Up', `Attempting to sign up with ${email}`);
    // On successful sign-up, navigate to EmailVerification
    // navigation.navigate('EmailVerification');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <View style={styles.formContainer}>
        <SecureTextBox
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <SecureTextBox
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <SecureTextBox
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.passwordStrengthContainer}>
          <Text style={styles.passwordStrengthLabel}>Password Strength</Text>
          <View style={styles.passwordStrengthBar}>
            {/* TODO: Dynamic width based on strength */}
            <View style={[styles.passwordStrengthFill, { width: '30%', backgroundColor: 'red' }]} />
          </View>
          <Text style={styles.passwordStrengthText}>{passwordStrength}</Text>
        </View>

        <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.signInLink}>
          <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  passwordStrengthContainer: {
    marginBottom: 20,
  },
  passwordStrengthLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  passwordStrengthBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  passwordStrengthText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  createAccountButton: {
    backgroundColor: '#007bff', // Blue button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInLink: {
    alignSelf: 'center',
  },
  signInLinkText: {
    color: '#007bff', // Blue for links
    fontSize: 14,
  },
});

export default SignUpScreen;