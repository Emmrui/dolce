import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { createListing, Category, Condition, DeliveryOption } from '../../services/listingsService'
import { useAuth } from '../../hooks/useAuth'
import { colors, radius, spacing } from '../../utils/theme'

const CATEGORIES: Category[] = ['dresses', 'jeans', 'bags', 'shoes', 'jackets', 'tops', 'other']
const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42']
const DELIVERY_OPTIONS: { value: DeliveryOption; label: string; sub: string }[] = [
  { value: 'courier', label: 'Courier', sub: 'Door-to-door · ~₪20–30' },
  { value: 'pickup_point', label: 'Pick-up point', sub: 'Supersol · Ksp · Yellow' },
  { value: 'self_pickup', label: 'Self pickup', sub: 'Arrange meetup via chat' },
]

export default function SellScreen({ navigation }: any) {
  const { dolceUser } = useAuth()
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [condition, setCondition] = useState<Condition | null>(null)
  const [delivery, setDelivery] = useState<DeliveryOption[]>(['courier'])
  const [loading, setLoading] = useState(false)

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return Alert.alert('Permission needed to access photos')
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 8,
    })
    if (!result.canceled) setImages(result.assets.map(a => a.uri))
  }

  const toggleDelivery = (opt: DeliveryOption) => {
    setDelivery(prev =>
      prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt]
    )
  }

  const handlePublish = async () => {
    if (!dolceUser) return
    if (!title || !price || !category || !size || !condition || delivery.length === 0)
      return Alert.alert('Please fill in all required fields')

    setLoading(true)
    try {
      await createListing(
        {
          sellerId: dolceUser.uid,
          sellerName: dolceUser.displayName,
          sellerCity: dolceUser.city,
          title: title.trim(),
          description: description.trim(),
          price: parseInt(price),
          category,
          size,
          condition,
          delivery,
        },
        images
      )
      Alert.alert('Listed!', 'Your item is now live.', [
        { text: 'OK', onPress: () => navigation.navigate('Shop') },
      ])
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>List an item</Text>
        <Text style={styles.sub}>Fill in the details to publish</Text>
      </View>

      {/* Photos */}
      <TouchableOpacity style={styles.uploadZone} onPress={pickImages}>
        {images.length === 0 ? (
          <>
            <Ionicons name="camera-outline" size={32} color={colors.rose} />
            <Text style={styles.uploadLabel}>Add photos</Text>
            <Text style={styles.uploadSub}>Up to 8 · tap to select</Text>
          </>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.previewImg} />
            ))}
            <TouchableOpacity style={styles.addMore} onPress={pickImages}>
              <Ionicons name="add" size={24} color={colors.rose} />
            </TouchableOpacity>
          </ScrollView>
        )}
      </TouchableOpacity>

      <Label text="Item name *" />
      <TextInput style={styles.input} placeholder="e.g. Black midi dress" placeholderTextColor={colors.mid} value={title} onChangeText={setTitle} />

      <Label text="Description" />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Fabric, brand, any details..." placeholderTextColor={colors.mid} multiline value={description} onChangeText={setDescription} />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Label text="Price (₪) *" />
          <TextInput style={styles.input} placeholder="150" placeholderTextColor={colors.mid} keyboardType="number-pad" value={price} onChangeText={setPrice} />
        </View>
        <View style={{ width: spacing.md }} />
        <View style={{ flex: 1 }}>
          <Label text="Category *" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 6, paddingBottom: 2 }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipSel]} onPress={() => setCategory(c)}>
                  <Text style={[styles.chipText, category === c && styles.chipTextSel]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <Label text="Size *" />
      <View style={styles.chipWrap}>
        {SIZES.map(s => (
          <TouchableOpacity key={s} style={[styles.chip, size === s && styles.chipSelDark]} onPress={() => setSize(s)}>
            <Text style={[styles.chipText, size === s && styles.chipTextSelDark]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Label text="Condition *" />
      <View style={styles.chipWrap}>
        {CONDITIONS.map(c => (
          <TouchableOpacity key={c.value} style={[styles.chip, condition === c.value && styles.chipSelDark]} onPress={() => setCondition(c.value)}>
            <Text style={[styles.chipText, condition === c.value && styles.chipTextSelDark]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Label text="Delivery options *" />
      {DELIVERY_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.deliveryOpt, delivery.includes(opt.value) && styles.deliveryOptSel]}
          onPress={() => toggleDelivery(opt.value)}
        >
          <View style={[styles.checkbox, delivery.includes(opt.value) && styles.checkboxSel]}>
            {delivery.includes(opt.value) && <Ionicons name="checkmark" size={12} color={colors.white} />}
          </View>
          <View>
            <Text style={styles.deliveryName}>{opt.label}</Text>
            <Text style={styles.deliverySub}>{opt.sub}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={loading}>
        {loading
          ? <ActivityIndicator color={colors.white} />
          : <Text style={styles.publishText}>Publish listing</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.mid, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 14 }}>{text}</Text>
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 60 },
  header: { marginBottom: spacing.lg },
  title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 24, color: colors.dark },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.mid, marginTop: 2 },
  uploadZone: { backgroundColor: colors.roseLight, borderWidth: 1.5, borderColor: colors.rose, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', minHeight: 110, marginBottom: spacing.md },
  uploadLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.rose, marginTop: 8 },
  uploadSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#B07060', marginTop: 4 },
  previewImg: { width: 80, height: 80, borderRadius: radius.md, marginRight: 8 },
  addMore: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.roseLight, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.dark },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.sm, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  chipSel: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipSelDark: { backgroundColor: colors.dark, borderColor: colors.dark },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.dark, textTransform: 'capitalize' },
  chipTextSel: { color: colors.white },
  chipTextSelDark: { color: colors.white },
  deliveryOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.md, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.md, marginBottom: 8 },
  deliveryOptSel: { borderColor: colors.sage, backgroundColor: colors.sageLight },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxSel: { backgroundColor: colors.sage, borderColor: colors.sage },
  deliveryName: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.dark },
  deliverySub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.mid },
  publishBtn: { marginTop: spacing.xl, backgroundColor: colors.dark, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center' },
  publishText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.white },
})
