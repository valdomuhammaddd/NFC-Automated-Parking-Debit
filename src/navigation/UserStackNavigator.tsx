/**
 * User Stack Navigator - MARKIR E-Parking
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserStackParamList } from '../data/types';
import { UserTabNavigator } from './UserTabNavigator';
import { AboutScreen } from '../screens/AboutScreen';

// 8 Feature Screens
import { NFCPaymentScreen } from '../screens/user/NFCPaymentScreen';
import { FindParkingScreen } from '../screens/user/FindParkingScreen';
import { HistoryScreen } from '../screens/user/HistoryScreen';
import { VehiclesScreen } from '../screens/user/VehiclesScreen';
import { BookingScreen } from '../screens/user/BookingScreen';
import { SubscriptionScreen } from '../screens/user/SubscriptionScreen';
import { PromotionScreen } from '../screens/user/PromotionScreen';
import { HelpScreen } from '../screens/user/HelpScreen';

// 5 Account Management Screens
import { InformasiPribadiScreen } from '../screens/user/InformasiPribadiScreen';
import { StatusMembershipScreen } from '../screens/user/StatusMembershipScreen';
import { KendaraanSayaScreen } from '../screens/user/KendaraanSayaScreen';
import { NotifikasiScreen } from '../screens/user/NotifikasiScreen';
import { PusatBantuanScreen } from '../screens/user/PusatBantuanScreen';

// Top Up Screen
import { TopUpScreen } from '../screens/user/TopUpScreen';

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="UserHome" component={UserTabNavigator} />
      <Stack.Screen name="About" component={AboutScreen} />
      
      {/* Top Up Screen */}
      <Stack.Screen 
        name="TopUp" 
        component={TopUpScreen}
        options={{ headerShown: true, title: 'Top Up Saldo' }}
      />
      
      {/* 8 Feature Screens */}
      <Stack.Screen name="NFCPayment" component={NFCPaymentScreen} />
      <Stack.Screen name="FindParking" component={FindParkingScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Vehicles" component={VehiclesScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />

      {/* 5 Account Management Screens */}
      <Stack.Screen name="InformasiPribadi" component={InformasiPribadiScreen} />
      <Stack.Screen name="StatusMembership" component={StatusMembershipScreen} />
      <Stack.Screen name="KendaraanSaya" component={KendaraanSayaScreen} />
      <Stack.Screen name="Notifikasi" component={NotifikasiScreen} />
      <Stack.Screen name="PusatBantuan" component={PusatBantuanScreen} />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
