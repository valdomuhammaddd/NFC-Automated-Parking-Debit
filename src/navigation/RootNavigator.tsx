/**
 * MARKIR - Root Navigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppSelector } from '../redux/hooks';
import UserStackNavigator from './UserStackNavigator';
import { AdminStackNavigator } from './AdminStackNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : user?.role === 'admin' ? (
            <Stack.Screen name="AdminStack" component={AdminStackNavigator} />
          ) : (
            <Stack.Screen name="UserStack" component={UserStackNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigator;
