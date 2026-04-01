import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';

export const UserHomeScreen = () => {
  const navigation = useNavigation<any>();
  const { currentUser, balance } = useAppSelector((state) => state.user);

  // Haptic feedback on navigation
  const handleNavigate = useCallback((screenName: string) => {
    console.log('🔹 [UserHomeScreen] Navigating to:', screenName);
    Vibration.vibrate(50); // Light haptic feedback
    
    try {
      // Navigate to parent stack navigator
      const parent = navigation.getParent();
      console.log('🔹 [UserHomeScreen] Parent navigator exists:', !!parent);
      console.log('🔹 [UserHomeScreen] Parent type:', parent?.getId());
      
      if (parent) {
        parent.navigate(screenName as never);
        console.log('✅ [UserHomeScreen] Navigation called successfully to:', screenName);
      } else {
        console.error('❌ [UserHomeScreen] Parent navigator not found!');
        // Fallback: try direct navigation
        console.log('🔹 [UserHomeScreen] Trying direct navigation...');
        navigation.navigate(screenName as never);
      }
    } catch (error) {
      console.error('❌ [UserHomeScreen] Navigation error:', error);
    }
  }, [navigation]);

  const features = [
    { id: 1, icon: 'card', label: 'Bayar', screen: 'NFCPayment', color: PRIMARY },
    { id: 2, icon: 'car-sport', label: 'Find Parking', screen: 'FindParking', color: PRIMARY },
    { id: 3, icon: 'time', label: 'History', screen: 'History', color: PRIMARY },
    { id: 4, icon: 'car', label: 'Vehicles', screen: 'Vehicles', color: PRIMARY },
    { id: 5, icon: 'calendar', label: 'Booking', screen: 'Booking', color: PRIMARY },
    { id: 6, icon: 'card', label: 'Subscription', screen: 'Subscription', color: PRIMARY },
    { id: 7, icon: 'pricetag', label: 'Promotion', screen: 'Promotion', color: PRIMARY },
    { id: 8, icon: 'help-circle', label: 'Help', screen: 'Help', color: PRIMARY },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{currentUser?.name || 'User'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Account')}
        >
          <Ionicons name="person-circle" size={40} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>
            Rp {(balance || 0).toLocaleString('id-ID')}
          </Text>
          <TouchableOpacity 
            style={styles.topUpButton}
            onPress={() => navigation.navigate('TopUp')}
          >
            <Ionicons name="add-circle" size={20} color={WHITE} />
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                onPress={() => handleNavigate(feature.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={feature.icon as any} size={32} color={feature.color} />
                </View>
                <Text style={styles.featureLabel}>{feature.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: WHITE,
  },
  greeting: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 2,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  profileButton: {
    padding: 4,
  },
  balanceCard: {
    backgroundColor: PRIMARY,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 16,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  topUpText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  featureCard: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    color: TEXT_DARK,
    textAlign: 'center',
    fontWeight: '500',
  },
});
