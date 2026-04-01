import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';

const RegistrationScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Registrasi NFC</Text>
    </View>
    <View style={styles.form}>
      <Text style={styles.label}>Plat Nomor</Text>
      <TextInput style={styles.input} placeholder="B 1234 XYZ" placeholderTextColor="#B0B0B0" />
      <Text style={styles.label}>User ID</Text>
      <TextInput style={styles.input} placeholder="User ID" placeholderTextColor="#B0B0B0" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SIAP TULIS TAG & REGISTER</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 18,
    alignItems: 'center',
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    color: PRIMARY,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 36,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 15,
    color: PRIMARY,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default RegistrationScreen;
