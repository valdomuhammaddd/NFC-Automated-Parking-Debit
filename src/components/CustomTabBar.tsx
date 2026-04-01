import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../redux/hooks';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';

const icons: { name: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'home' },
  { name: 'person' },
  { name: 'scan-outline' }, // Scan NFC - Fitur Utama
  { name: 'radio' }, // Tukar dengan wallet (yang tadinya di kiri)
  { name: 'information-circle' },
];

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Handle center NFC button - SCAN NFC LANGSUNG (Fitur Utama)
  const handleNFCPress = () => {
    Vibration.vibrate(15); // Haptic feedback
    
    // Navigate to parent stack, then to NFCPayment screen
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('NFCPayment');
    }
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName = icons[index].name;

        // Center NFC Button
        if (index === 2) {
          return (
            <View key={route.key} style={styles.fabContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Tap NFC Payment"
                style={styles.fab}
                onPress={handleNFCPress}
                activeOpacity={0.8}
              >
                <Ionicons name={iconName} size={32} color={WHITE} />
              </TouchableOpacity>
            </View>
          );
        }

        // Regular tabs
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.tab}
            onPress={() => {
              Vibration.vibrate(10); // Light haptic
              navigation.navigate(route.name);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? PRIMARY : '#D0D0D0'} />
            <Text style={[styles.label, isFocused && { color: PRIMARY }]}>
              {options.tabBarLabel || options.title || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    marginTop: 3,
    color: '#BDBDBD',
    fontWeight: '500',
  },
  fabContainer: {
    position: 'relative',
    top: -20,
    width: 70,
    alignItems: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CustomTabBar;
