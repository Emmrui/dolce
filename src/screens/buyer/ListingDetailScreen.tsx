import React, { useEffect, useState } from 'react'
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Linking, Alert, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getListing, Listing } from '../../services/listingsService'
import { colors, radius, spacing } from '../../utils/theme'

const CONDITION_LABEL: Record<string, string> = {
  like_new: 'Like new',
  good: 'Good condition',
  fair: 'Fair condition',
}

const DELIVERY_LABEL: Record<string, string> = {
  courier: 'Courier (door-to-door)',
  pickup_point: 'Pick-up point (Supersol, Ksp...)',
  self_pickup: 'Self pickup — arrange via chat',
}

export default function ListingDetailScreen({ route, navigation }: any) {
  const { listingId } = route.params
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [payMethod, setPayMethod] = useState<'bit' | 'card'>('bit')

  useEffect(() => {
    getListing(listingId).then(l => {
      setListing(l)
      setLoading(false)
    })
  }, [listingId])

  const handleBitPayment = () => {
    if (!listing) return
    // Opens the Bit app with pre-filled amount and note
    // The seller's phone number should be stored; here we use a deep link
    // Real production flow: your backend generates a payment request
    const bitUrl = `https://bitpay.onelink.me/pay?amount=${listing.price}&note=${encodeURIComponent(listing.title)}`
    Linking.openURL(bitUrl).catch(() =>
      Alert.alert('Bit not installed', 'Please install the Bit app to pay this way, or choose credit card.')
    )
  }

  const handleCardPayment = () => {
    // Navigate to a card payment screen (Stripe / Tranzila integration)
    Alert.alert('Coming soon', 'Card payment will be available shortly.')
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.rose} />
  if (!listing) return <Text style={{ padding: 20 }}>Item not found</Text>

  const serviceFee = Math.round(listing.price * 0.02)
  const shippingFee = listing.delivery.includes('courier') ? 25 : 0
  const total = listing.price + shippingFee + serviceFee

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imgWrap}>
          {listing.images[0]
            ? <Image source={{ uri: listing.images[0] }} style={styles.image} />
            : <View style={[styles.image, styles.imgFallback]}><Ionicons name="image-outline" size={48} color={colors.mid} /></View>
          }
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>₪{listing.price}</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{listing.size}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{CONDITION_LABEL[listing.condition]}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText} numberOfLines={1}>{listing.category}</Text></View>
          </View>

          <View style={styles.sellerRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{listing.sellerName[0]}</Text></View>
            <View>
              <Text style={styles.sellerName}>{listing.sellerName}</Text>
              <Text style={styles.sellerCity}>{listing.sellerCity}</Text>
            </View>
          </View>

          {listing.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.desc}>{listing.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery options</Text>
            {listing.delivery.map(d => (
              <View key={d} style={styles.deliveryRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.sage} />
                <Text style={styles.deliveryText}>{DELIVERY_LABEL[d]}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <TouchableOpacity style={[styles.payOpt, payMethod === 'bit' && styles.payOptSel]} onPress={() => setPayMethod('bit')}>
              <View style={styles.bitLogo}><Text style={styles.bitLogoText}>bit</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payName}>Bit</Text>
                <Text style={styles.paySub}>Instant mobile payment</Text>
              </View>
              <View style={[styles.radio, payMethod === 'bit' && styles.radioSel]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.payOpt, payMethod === 'card' && styles.payOptSel]} onPress={() => setPayMethod('card')}>
              <View style={styles.ccLogo}><Ionicons name="card-outline" size={18} color={colors.mid} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payName}>Credit card</Text>
                <Text style={styles.paySub}>Visa / Mastercard</Text>
              </View>
              <View style={[styles.radio, payMethod === 'card' && styles.radioSel]} />
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <View style={styles.sumRow}><Text style={styles.sumLabel}>Item</Text><Text style={styles.sumVal}>₪{listing.price}</Text></View>
            <View style={styles.sumRow}><Text style={styles.sumLabel}>Shipping</Text><Text style={styles.sumVal}>{shippingFee > 0 ? `₪${shippingFee}` : 'Free'}</Text></View>
            <View style={styles.sumRow}><Text style={styles.sumLabel}>Service fee</Text><Text style={styles.sumVal}>₪{serviceFee}</Text></View>
            <View style={[styles.sumRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>₪{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={payMethod === 'bit' ? handleBitPayment : handleCardPayment}
        >
          <Text style={styles.buyBtnText}>
            {payMethod === 'bit' ? 'Pay with ' : 'Pay ₪'}
            {payMethod === 'bit' && <Text style={styles.bitInline}>bit</Text>}
            {payMethod === 'card' && total}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  imgWrap: { position: 'relative' },
  image: { width: '100%', height: 320 },
  imgFallback: { backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: colors.white, borderRadius: radius.pill, padding: 8 },
  body: { padding: spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  title: { flex: 1, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, color: colors.dark, marginRight: spacing.md },
  price: { fontFamily: 'Inter_500Medium', fontSize: 22, color: colors.rose },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.light, borderRadius: radius.pill },
  tagText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.mid, textTransform: 'capitalize' },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.roseLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 18, color: colors.rose },
  sellerName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.dark },
  sellerCity: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.mid },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.mid, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: spacing.sm },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.dark, lineHeight: 22 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  deliveryText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.dark },
  payOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.md, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, marginBottom: 8 },
  payOptSel: { borderColor: colors.rose, borderWidth: 1.5 },
  bitLogo: { width: 44, height: 28, borderRadius: 6, backgroundColor: colors.bitBlueBg, alignItems: 'center', justifyContent: 'center' },
  bitLogoText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.bitBlue },
  ccLogo: { width: 44, height: 28, borderRadius: 6, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  payName: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.dark },
  paySub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.mid },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border },
  radioSel: { borderColor: colors.rose, backgroundColor: colors.rose },
  summary: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.xl },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sumLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.mid },
  sumVal: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.mid },
  totalRow: { borderTopWidth: 0.5, borderTopColor: colors.border, paddingTop: 10, marginTop: 4 },
  totalLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.dark },
  totalVal: { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.dark },
  footer: { padding: spacing.lg, paddingBottom: 32, backgroundColor: colors.white, borderTopWidth: 0.5, borderTopColor: colors.border },
  buyBtn: { backgroundColor: colors.rose, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center' },
  buyBtnText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.white },
  bitInline: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.white },
})
