import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';

const AboutScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Tentang Kami</Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>Valdo Muhammad</Text>
      <Text style={styles.desc}>Mahasiswa SK UIGM</Text>
      <Text style={styles.ig}>Instagram: <Text style={styles.igHandle}>@valdomuhammadd</Text></Text>
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
  content: {
    marginTop: 48,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    color: PRIMARY,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  ig: {
    fontSize: 15,
    color: '#444',
  },
  igHandle: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
