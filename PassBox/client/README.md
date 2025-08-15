# PassBox Mobile Application

This is a cross-platform (iOS + Android) password manager mobile application built with React Native (Expo) and Supabase.

## Features

*   Secure authentication (email/password, biometric unlock)
*   Client-side strong password generation
*   End-to-end encrypted storage of vault items
*   CRUD operations for vault items
*   Client-side search and sort
*   Copy to clipboard with auto-clear
*   Offline-first capabilities with synchronization
*   Settings for master password change, theme, and encrypted backup export/import

## Tech Stack

*   **Frontend**: React Native (Expo SDK 50+), TypeScript, React Navigation v7, React Query, Zod, FlashList
*   **Crypto**: `argon2`, `expo-crypto`, `react-native-crypto` (Polyfills)
*   **Clipboard**: `expo-clipboard`
*   **Backend**: Supabase (`@supabase/supabase-js 3.x` with PostgREST)
*   **Local Storage**: Expo SQLite / MMKV (to be decided during implementation)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone [repository-url]
cd PassBox/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `PassBox/client` directory with the following content:

```
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project URL and public anon key.

### 4. Run the Application

```bash
npm start
```

This will open the Expo Dev Tools in your browser. You can then choose to run the app on an iOS simulator, Android emulator, or your physical device using the Expo Go app.

## Supabase Setup

Before running the application, ensure you have a Supabase project set up. The necessary SQL schema and RLS policies are provided in `supabase/migrations/YYYYMMDDHHMMSS_create_schema.sql`.

## Security Notes

*   **Zero-knowledge architecture**: The server stores only ciphertext; decryption keys stay on the device.
*   **Secure storage**: Master-key material is persisted in Expo SecureStore (iOS Keychain / Android Keystore).
*   **Encryption**: All sensitive data is encrypted on the device using AES-GCM with a key derived from your master password via Argon2id.

## Contributing

(To be added later)

## License

(To be added later)