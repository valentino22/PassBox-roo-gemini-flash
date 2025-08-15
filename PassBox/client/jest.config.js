module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-expo|react-native|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|expo-router|react-native-reanimated|@react-native-community|expo-clipboard|expo-local-authentication|@stablelib/argon2|@supabase/supabase-js|@tanstack/react-query|zod|@shopify/flash-list)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};