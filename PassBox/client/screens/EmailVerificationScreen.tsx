import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import { Ionicons } from '@expo/vector-icons';

type EmailVerificationScreenProps = StackScreenProps<AuthStackParamList, 'EmailVerification'>;

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation }) => {
  const handleOpenMailApp = () => {
    // Attempt to open the default mail app
    Linking.openURL('mailto:');
  };

  const handleResendCode = () => {
    // TODO: Implement logic to resend verification code
    console.log('Resending verification code...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {/* TODO: Replace with actual email verification image */}
          <Image source={require('../assets/images/email-verification.txt')} style={styles.emailImage} />
        </View>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your email. Please check your inbox and enter the code to
          continue.
        </Text>

        <TouchableOpacity style={styles.openMailButton} onPress={handleOpenMailApp}>
          <Text style={styles.openMailButtonText}>Open Mail App</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendCodeText}>Resend Code</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for bottom navigation, as seen in screenshot */}
      <View style={styles.bottomNavPlaceholder}>
        <Ionicons name="home" size={24} color="#fff" style={styles.navIcon} />
        <Ionicons name="key" size={24} color="#fff" style={styles.navIcon} />
        <Ionicons name="add-circle" size={24} color="#fff" style={styles.navIcon} />
        <Ionicons name="settings" size={24} color="#fff" style={styles.navIcon} />
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
    // No specific styling needed here, just for positioning
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#d4c0a8', // Background color from screenshot
    borderRadius: 100, // Make it circular if needed, or adjust to match image shape
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emailImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  openMailButton: {
    backgroundColor: '#333', // Dark grey button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  openMailButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendCodeText: {
    color: '#007bff', // Blue for links
    fontSize: 14,
  },
  bottomNavPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222', // Darker background for nav bar
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navIcon: {
    // Styling for individual icons if needed
  },
});

export default EmailVerificationScreen;