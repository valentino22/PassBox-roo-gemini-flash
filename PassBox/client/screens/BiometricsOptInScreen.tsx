import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

type BiometricsOptInScreenProps = StackScreenProps<AuthStackParamList, 'BiometricsOptIn'>;

const BIOMETRICS_ENABLED_KEY = 'biometricsEnabled';

const BiometricsOptInScreen: React.FC<BiometricsOptInScreenProps> = ({ navigation }) => {
  const handleEnableBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const authenticated = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometrics',
        fallbackLabel: 'Enter Password',
      });

      if (authenticated.success) {
        await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, 'true');
        console.log('Biometrics enabled successfully!');
        // Navigate to the main app stack
        // TODO: Replace with actual navigation to AppStack
        // navigation.navigate('AppStack');
      } else {
        console.log('Biometrics authentication failed or cancelled.');
      }
    } else {
      console.log('Biometric hardware not available or not enrolled.');
      // Optionally, inform the user
    }
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, 'false');
    console.log('Biometrics skipped.');
    // Navigate to the main app stack
    // TODO: Replace with actual navigation to AppStack
    // navigation.navigate('AppStack');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable biometrics</Text>
      <Text style={styles.subtitle}>
        Use your fingerprint or face to unlock the app quickly and securely.
      </Text>

      <TouchableOpacity style={styles.enableButton} onPress={handleEnableBiometrics}>
        <Text style={styles.enableButtonText}>Enable</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Placeholder for pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  enableButton: {
    backgroundColor: '#007bff', // Blue button
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#333', // Dark grey button
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});

export default BiometricsOptInScreen;