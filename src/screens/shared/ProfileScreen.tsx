import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  ActivityIndicator, Alert, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { fetchMyListings, Listing } from '../../services/listingsService'
import { logOut } from '../../services/authService'
import { colors, radius, spacing } from '../../utils/theme'

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  active: { bg: colors.sageLight, text: colors.success ?? '#3B6D11' },
  sold: { bg: colors.roseLight, text: '#993C1D' },
  reserved: { bg: '#FFF8E1', text: '#856404' },
}

export default function ProfileScreen() {
  const { dolceUser, switchMode } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'listings' | 'purchases' | 'saved'>('listings')

  const loadListings = useCallback(async () => {
    if (!dolceUser) return
    const data = await fetchMyListings(dolceUser.uid)
    setListings(data)
    setLoading(false)
  }, [dolceUser])

  useEffect(() => { loadListings() }, [loadListings])

  const handleModeToggle = async () => {
    if (!dolceUser) return
    const next = dolceUser.mode === 'buyer' ? 'seller' : 'buyer'
    await switchMode(next)
  }

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logOut },
    ])
  }

  if (!dolceUser) return null

  const initials = dolceUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <Text style={styles.name}>{dolceUser.displayName}</Text>
        <Text style={styles.handle}>@{dolceUser.displayName.toLowerCase().replace(' ', '.')} · {dolceUser.city}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{listings.filter(l => l.status === 'active').length}</Text>
            <Text style={styles.statLabel}>listings</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statNum}>{dolceUser.rating > 0 ? `${dolceUser.rating}★` : '–'}</Text>
            <Text style={styles.statLabel}>rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{dolceUser.totalSales}</Text>
            <Text style={styles.statLabel}>sold</Text>
          </View>
        </View>

        {/* Buyer / Seller mode toggle */}
        <TouchableOpacity style={styles.modeToggle} onPress={handleModeToggle}>
          <View style={[styles.modeTab, dolceUser.mode === 'buyer' && styles.modeTabActive]}>
            <Ionicons name="bag-outline" size={14} color={dolceUser.mode === 'buyer' ? colors.white : colors.mid} />
            <Text style={[styles.modeTabText, dolceUser.mode === 'buyer' && styles.modeTabTextActive]}>Buyer</Text>
          </View>
          <View style={[styles.modeTab, dolceUser.mode === 'seller' && styles.modeTabActive]}>
            <Ionicons name="storefront-outline" size={14} color={dolceUser.mode === 'seller' ? colors.white : colors.mid} />
            <Text style={[styles.modeTabText, dolceUser.mode === 'seller' && styles.modeTabTextActive]}>Seller</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {(['listings', 'purchases', 'saved'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'listings' ? (
        loading
          ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.rose} />
          : <FlatList
              data={listings}
              keyExtractor={l => l.id!}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<Text style={styles.empty}>No listings yet. Hit Sell to start!</Text>}
              renderItem={({ item }) => {
                const sc = STATUS_COLOR[item.status]
                return (
                  <View style={styles.listingRow}>
                    <View style={[styles.listingThumb, { backgroundColor: colors.light }]}>
                      <Ionicons name="shirt-outline" size={20} color={colors.mid} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listingName} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.listingMeta}>₪{item.price} · {item.size}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
                    </View>
                  </View>
                )
              }}
            />
      ) : (
        <Text style={styles.empty}>Coming soon</Text>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={colors.mid} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.white, padding: spacing.lg, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.border },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.roseLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: colors.rose },
  name: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: colors.dark },
  handle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.mid, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: spacing.md, width: '100%' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statBorder: { borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: colors.border },
  statNum: { fontFamily: 'Inter_500Medium', fontSize: 20, color: colors.dark },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.mid, letterSpacing: 0.4 },
  modeToggle: { flexDirection: 'row', backgroundColor: colors.light, borderRadius: radius.md, overflow: 'hidden', marginTop: spacing.md, alignSelf: 'stretch' },
  modeTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9 },
  modeTabActive: { backgroundColor: colors.dark },
  modeTabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.mid },
  modeTabTextActive: { color: colors.white },
  tabRow: { flexDirection: 'row', backgroundColor: colors.white, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  tab: { flex: 1, padding: spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.rose },
  tabText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.mid },
  tabTextActive: { fontFamily: 'Inter_500Medium', color: colors.rose },
  list: { padding: spacing.md },
  listingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: spacing.md, marginBottom: 8 },
  listingThumb: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  listingName: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.dark },
  listingMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.mid },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontFamily: 'Inter_500Medium', fontSize: 10, textTransform: 'capitalize' },
  empty: { textAlign: 'center', marginTop: 40, fontFamily: 'Inter_400Regular', color: colors.mid, padding: spacing.lg },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: spacing.xl },
  logoutText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.mid },
})
