import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';

export const ListMenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon as any} size={22} color={PRIMARY} style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#B0B0B0" style={styles.arrow} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});
export default ListMenuItem;
