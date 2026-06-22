import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, View } from 'react-native'

import { useAuth } from '../hooks/useAuth'
import { colors } from '../utils/theme'

import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import ShopScreen from '../screens/buyer/ShopScreen'
import ListingDetailScreen from '../screens/buyer/ListingDetailScreen'
import SellScreen from '../screens/seller/SellScreen'
import ProfileScreen from '../screens/shared/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.mid,
        tabBarLabelStyle: { fontFamily: 'Inter_400Regular', fontSize: 10 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            ShopTab: ['home', 'home-outline'],
            SellTab: ['add-circle', 'add-circle-outline'],
            ProfileTab: ['person', 'person-outline'],
          }
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline']
          return <Ionicons name={(focused ? active : inactive) as any} size={22} color={color} />
        },
      })}
    >
      <Tab.Screen name="ShopTab" component={ShopStack} options={{ title: 'Shop' }} />
      <Tab.Screen name="SellTab" component={SellScreen} options={{ title: 'Sell' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.rose} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {firebaseUser ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  )
}
