/**
 * MINIMAL APP FOR TESTING - Use this if main App.tsx has issues
 * 
 * To test: Rename App.tsx to App.backup.tsx
 *          Rename this file to App.tsx
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const handlePress = () => {
    Alert.alert('Success!', 'App is working! 🎉');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>✅ MARKIR</Text>
      <Text style={styles.subtitle}>Minimal Test Version</Text>
      
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Test Button</Text>
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>✅ React Native: Working</Text>
        <Text style={styles.infoText}>✅ TypeScript: Compiled</Text>
        <Text style={styles.infoText}>✅ Expo: Running</Text>
      </View>
      
      <Text style={styles.footer}>
        If you see this, basic app structure is OK!{'\n'}
        Now we can add features one by one.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
