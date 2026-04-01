/**
 * MARKIR - Loading Overlay Component
 * Professional loading indicator for async operations
 * @author Valdo Muhammad - Lead Developer & UI/UX Designer
 */

import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  Modal,
  StatusBar 
} from 'react-native';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#171717';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  visible, 
  message = 'Loading...' 
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
