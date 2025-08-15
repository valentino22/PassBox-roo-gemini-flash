The primary goal of PassBox is to provide individual users with a secure and convenient way to manage their digital credentials. It aims to solve the problem of users struggling with remembering multiple complex passwords by offering a robust solution for generating, storing, and accessing encrypted account records.

## 2. Goals

*   Enable users to securely sign up, sign in, and sign out using email/password and biometric authentication.
*   Provide a client-side strong password generator.
*   Allow users to store, search, view, copy, and edit end-to-end encrypted account records.
*   Ensure a zero-knowledge architecture where decryption keys remain on the device.
*   Provide an offline-first experience with robust synchronization.

## 3. User Stories

*   **As a new user**, I want to sign up with my email and a master password, so that I can start securing my accounts.
*   **As a new user**, I want to verify my email address after signing up, so that my account is fully activated and secure.
*   **As a returning user**, I want to sign in with my email and master password, so that I can access my stored credentials.
*   **As a returning user**, I want to use biometric authentication (Face ID/Touch ID) to unlock my vault, so that I can quickly and securely access my passwords without typing my master password every time.
*   **As a user**, I want to generate a strong, unique password with customizable options (length, symbols, numbers, upper/lowercase), so that I can create secure credentials for new accounts.
*   **As a user**, I want to securely store my account details (title, username, password, URL, notes) in an encrypted vault, so that my sensitive information is protected.
*   **As a user**, I want to search my vault items by title, username, or URL, so that I can quickly find specific account records.
*   **As a user**, I want to view the details of a saved account, including the ability to toggle password visibility, so that I can easily retrieve my credentials.
*   **As a user**, I want to copy my username or password to the clipboard with a single tap, so that I can easily paste them into other applications.
*   **As a user**, I want the copied password/username to be cleared from the clipboard automatically after a short period, so that my sensitive data is not exposed.
*   **As a user**, I want to edit existing vault items, so that I can update my credentials or other account details.
*   **As a user**, I want to delete vault items that are no longer needed, so that my vault remains organized.
*   **As a user**, I want to change my master password, and have all my existing vault items re-encrypted with the new key, so that my security is maintained.
*   **As a user**, I want to export an encrypted backup of my vault, so that I have a copy of my data.
*   **As a user**, I want to import an encrypted backup, so that I can restore my data on a new device or after a reinstallation.
*   **As a user**, I want the app to work even when I'm offline, and synchronize my changes when I'm back online, so that I can always access my passwords.
*   **As a user**, I want to switch between light and dark themes, so that I can customize the app's appearance to my preference.

## 4. Functional Requirements

1.  **Authentication (F-1)**
    *   The system must allow users to sign up using email and password.
    *   The system must enforce email verification; users will be prevented from logging in until their email is verified, with a clear message to check their inbox.
    *   The system must support password reset functionality.
    *   The system must support biometric unlock (Face ID/Touch ID) using `expo-local-authentication`.
    *   The system must allow users to sign out.
2.  **Local Encryption (F-2)**
    *   The system must derive a 256-bit AES-GCM key from the user’s master password using Argon2id (operations ≥ 3, memory ≥ 64 MB).
    *   The system must encrypt and decrypt all secrets (passwords, notes) exclusively on the device.
    *   The system must never send raw passwords to the Supabase backend.
    *   The system must store `ciphertext`, `IV`, and `salt` for each encrypted item in the database.
3.  **Password Generator (F-3)**
    *   The system must provide options for password length (8-64 characters).
    *   The system must allow users to include/exclude symbols, numbers, uppercase letters, and lowercase letters.
    *   The system must use a cryptographically secure random number generator (`expo-crypto`).
4.  **CRUD for Vault Items (F-4)**
    *   Each vault item must include: `id`, `title`, `username`, `encryptedPassword`, `url`, `notes`, `createdAt`, `updatedAt`.
    *   The system must allow users to create new vault items.
    *   The system must allow users to read/view details of existing vault items.
    *   The system must allow users to update existing vault items.
    *   The system must allow users to delete vault items.
5.  **Search & Sort (F-5)**
    *   The system must provide client-side search functionality (debounced) across `title`, `username`, and `url` fields.
    *   The system must allow sorting of vault items by `title` or `updatedAt`.
6.  **Copy to Clipboard (F-6)**
    *   The system must provide dedicated buttons to copy username and password to the clipboard.
    *   The system must clear the clipboard content after 30 seconds for security.
    *   The system must provide haptic feedback upon successful copy.
    *   The system must display a toast notification upon successful copy.
7.  **Offline First (F-7)**
    *   The system must cache encrypted vault items locally using Expo SQLite or MMKV.
    *   The system must synchronize local changes with the Supabase backend when online.
    *   In case of conflicts during synchronization, the most recent modification (based on `updated_at` timestamp) should always win.
8.  **Settings (F-8)**
    *   The system must provide a toggle for biometric unlock.
    *   The system must allow users to change their master password, which will trigger re-encryption of all vault items.
    *   The system must allow users to change the application theme (light/dark).
    *   The system must allow users to export an encrypted backup of their vault in `.json` format.
    *   The system must allow users to import an encrypted backup of their vault from a `.json` file.

## 5. Non-Goals (Out of Scope)

*   Team or shared vault functionality.
*   Browser extensions or desktop applications.
*   Advanced password auditing features (e.g., checking for compromised passwords).
*   Complex custom fields for vault items beyond the specified schema.

## 6. Design Considerations (Optional)

*   **Key Screens**:
    *   **Auth Stack**: Welcome → Sign In → Sign Up → Email verification → Biometrics opt-in.
    *   **Vault List**: Search bar, add-item FAB, item cards with copy icons.
    *   **Item Detail / Edit**: Secure text boxes, visibility toggle, generator drawer.
    *   **Settings**: Biometrics toggle, change master password, theme, export, import.
*   **Performance**: Utilize `FlashList` for efficient scrolling lists. Implement lazy image loading and memoization where appropriate.
*   **Accessibility**: Adhere to WCAG 2.2 AA guidelines, including proper labels, focus order, and tri-state toggles.
*   **UI/UX**: Follow modern mobile design principles for a clean, intuitive, and secure user experience.

## 7. Technical Considerations (Optional)

*   **Tech Stack**: React Native (Expo SDK 50+), TypeScript, React Navigation v7, React Query, Zod, FlashList.
*   **Cryptography Libraries**: `react-native-crypto` (Polyfills), `@stablelib/argon2`, `expo-crypto`.
*   **Clipboard**: `expo-clipboard`.
*   **Supabase Client**: `@supabase/supabase-js 3.x` with PostgREST.
*   **Secure Storage**: `Expo SecureStore` for master-key material.
*   **Supabase RLS**: Enable Row-Level Security on `vault_items` with policies: `user_id = auth.uid()`.
*   **Supabase Edge Functions**: Leverage for rate limiting and MFA hooks.
*   **Dependency Hygiene**: Pin all packages, run `npm audit` and `supabase db diff` CI checks.
*   **Static Analysis**: Integrate ESLint, TypeScript strict mode, React Native Security-Code-Scan.

## 8. Success Metrics

*   Successful user sign-ups and sign-ins.
*   High user retention for active vault management.
*   Positive user feedback on ease of use and security.
*   All functional requirements are met and tested.
*   Application builds without warnings.
*   ESLint `npm run lint` returns 0 errors.
*   No plaintext secrets, weak RNG, or missing certificate pinning identified during security review.

## 9. Open Questions

*   None at this time.