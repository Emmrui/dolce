import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native'
import { logIn } from '../../services/authService'
import { colors, radius, spacing } from '../../utils/theme'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Please fill in all fields')
    setLoading(true)
    try {
      await logIn(email.trim(), password)
    } catch (e: any) {
      Alert.alert('Login failed', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>Dolce<Text style={styles.dot}>.</Text></Text>
        <Text style={styles.sub}>Buy & sell clothes you love</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.mid}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.mid}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Log in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  inner: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  logo: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 40, color: colors.dark, textAlign: 'center', marginBottom: spacing.xs },
  dot: { color: colors.rose },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.mid, textAlign: 'center', marginBottom: spacing.xxl },
  input: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  btn: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  btnText: { color: colors.white, fontFamily: 'Inter_500Medium', fontSize: 16 },
  link: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.mid },
  linkBold: { fontFamily: 'Inter_500Medium', color: colors.rose },
})
