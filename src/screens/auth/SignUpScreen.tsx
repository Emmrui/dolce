import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, SafeAreaView,
} from 'react-native'
import { signUp } from '../../services/authService'
import { colors, radius, spacing } from '../../utils/theme'

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!name || !email || !phone || !city || !password)
      return Alert.alert('Please fill in all fields')
    if (password.length < 6)
      return Alert.alert('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signUp(email.trim(), password, name.trim(), phone.trim(), city.trim())
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>Dolce<Text style={styles.dot}>.</Text></Text>
        <Text style={styles.sub}>Create your account</Text>

        {([
          ['Full name', name, setName, 'words', false],
          ['Email', email, setEmail, 'email-address', false],
          ['Phone (for Bit payments)', phone, setPhone, 'phone-pad', false],
          ['City', city, setCity, 'words', false],
          ['Password', password, setPassword, 'default', true],
        ] as const).map(([label, val, setter, kb, secure]) => (
          <View key={label} style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={label}
              placeholderTextColor={colors.mid}
              autoCapitalize={kb === 'email-address' ? 'none' : 'sentences'}
              keyboardType={kb as any}
              secureTextEntry={secure}
              value={val}
              onChangeText={setter as any}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Create account</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  inner: { padding: spacing.xl, paddingTop: spacing.xxl * 2 },
  logo: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 36, color: colors.dark, textAlign: 'center', marginBottom: spacing.xs },
  dot: { color: colors.rose },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.mid, textAlign: 'center', marginBottom: spacing.xl },
  fieldWrap: { marginBottom: spacing.md },
  label: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.mid, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.dark,
  },
  btn: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  btnText: { color: colors.white, fontFamily: 'Inter_500Medium', fontSize: 16 },
  link: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.mid },
  linkBold: { fontFamily: 'Inter_500Medium', color: colors.rose },
})
