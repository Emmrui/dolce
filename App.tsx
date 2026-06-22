import React from 'react'
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display'
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet, ActivityIndicator, View } from 'react-native'

import { AuthProvider } from './src/hooks/useAuth'
import AppNavigator from './src/navigation/AppNavigator'
import { colors } from './src/utils/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    Inter_400Regular,
    Inter_500Medium,
  })

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.rose} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream },
})
