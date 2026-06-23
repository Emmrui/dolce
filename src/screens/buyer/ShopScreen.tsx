import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, TextInput, RefreshControl, ActivityIndicator, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fetchListings, Listing, Category } from '../../services/listingsService'
import { colors, radius, spacing } from '../../utils/theme'

const CATEGORIES: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Jeans', value: 'jeans' },
  { label: 'Bags', value: 'bags' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Jackets', value: 'jackets' },
  { label: 'Tops', value: 'tops' },
]

export default function ShopScreen({ navigation }: any) {
  const [listings, setListings] = useState<Listing[]>([])
  const [filtered, setFiltered] = useState<Listing[]>([])
  const [selectedCat, setSelectedCat] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (cat: Category | 'all' = selectedCat) => {
    try {
      const data = await fetchListings(cat === 'all' ? undefined : cat)
      setListings(data)
      setFiltered(data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedCat])

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.sellerCity.toLowerCase().includes(q)
      )
    )
  }, [search, listings])

  const onCatPress = (cat: Category | 'all') => {
    setSelectedCat(cat)
    setLoading(true)
    load(cat)
  }

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
    >
      {item.images[0]
        ? <Image source={{ uri: item.images[0] }} style={styles.image} />
        : <View style={[styles.image, styles.imageFallback]}><Ionicons name="image-outline" size={32} color={colors.mid} /></View>
      }
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{item.size} · {item.condition.replace('_', ' ')}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>₪{item.price}</Text>
          <Ionicons name="heart-outline" size={18} color={colors.mid} />
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Dolce<Text style={styles.dot}>.</Text></Text>
        <Ionicons name="notifications-outline" size={22} color={colors.dark} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color={colors.mid} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items, brands, sizes..."
          placeholderTextColor={colors.mid}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id!}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <FlatList
            data={CATEGORIES}
            keyExtractor={c => c.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            renderItem={({ item: cat }) => (
              <TouchableOpacity
                style={[styles.chip, selectedCat === cat.value && styles.chipSel]}
                onPress={() => onCatPress(cat.value)}
              >
                <Text style={[styles.chipText, selectedCat === cat.value && styles.chipTextSel]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />}
        ListEmptyComponent={
          loading
            ? <ActivityIndicator style={{ marginTop: 60 }} color={colors.rose} />
            : <Text style={styles.empty}>No items found</Text>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.white, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  logo: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 24, color: colors.dark },
  dot: { color: colors.rose },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: spacing.md, padding: spacing.md, backgroundColor: colors.white, borderRadius: radius.pill, borderWidth: 0.5, borderColor: colors.border },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.dark },
  chips: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  chipSel: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.dark },
  chipTextSel: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  row: { gap: spacing.sm, marginBottom: spacing.sm },
  card: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  image: { width: '100%', height: 140 },
  imageFallback: { backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: spacing.sm },
  cardTitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.dark, marginBottom: 2 },
  cardMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.mid, marginBottom: 6, textTransform: 'capitalize' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.rose },
  empty: { textAlign: 'center', marginTop: 60, fontFamily: 'Inter_400Regular', color: colors.mid },
})
