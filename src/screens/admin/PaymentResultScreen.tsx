import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PRIMARY = '#0077B6';
const ACCENT = '#48CAE4';
const WHITE = '#FFFFFF';
const GREEN = '#2ecc71';
const RED = '#e74c3c';
const YELLOW = '#f1c40f';

const states = [
  { label: 'LUNAS', color: GREEN },
  { label: 'TERTUNGGAK', color: YELLOW },
  { label: 'MEMBER_GRATIS', color: ACCENT },
];

const PaymentResultScreen = ({ stateIndex = 0 }) => {
  const state = states[stateIndex];
  return (
    <View style={styles.overlay}>
      <View style={[styles.resultBox, { backgroundColor: state.color }]}> 
        <Text style={styles.resultText}>{state.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    minWidth: 180,
    minHeight: 120,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  resultText: {
    fontSize: 28,
    color: WHITE,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default PaymentResultScreen;
