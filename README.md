# Dolce — second-hand clothes marketplace

## Stack
- React Native (Expo)
- Firebase (Auth + Firestore + Storage)
- Navigation: React Navigation v6
- Fonts: Playfair Display + Inter

## Setup

### 1. Install dependencies
```bash
npm install
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/inter
```

### 2. Add Firebase config
Create a `.env` file at the root (copy from `.env.example`):
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### 3. Firestore indexes needed
In Firebase console, add these composite indexes:
- `listings`: `status ASC, createdAt DESC`
- `listings`: `status ASC, category ASC, createdAt DESC`
- `listings`: `sellerId ASC, createdAt DESC`

### 4. Firebase Storage rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{listingId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Run
```bash
npx expo start
```

## Project structure
```
src/
  screens/
    auth/         LoginScreen, SignUpScreen
    buyer/        ShopScreen, ListingDetailScreen
    seller/       SellScreen
    shared/       ProfileScreen
  services/
    firebase.ts   Firebase init
    authService.ts  Sign up / login / user management
    listingsService.ts  CRUD for listings + image upload
  hooks/
    useAuth.tsx   Auth context + real-time user sync
  navigation/
    AppNavigator.tsx  Auth stack + main tabs
  utils/
    theme.ts      Colors, fonts, spacing
```

## Bit payment
The current implementation uses a Bit deep link (`bitpay.onelink.me`) which opens the Bit app pre-filled with the amount and item title. The seller's phone number should be stored at listing creation and passed in the link for a full flow.

## Shipping options (Israel)
- **Courier**: iPost, Cargo, Tik-tak — integrate via their business APIs for label generation
- **Pick-up points**: Supersol, Ksp, Yellow — sellers drop off, buyers collect
- **Self pickup**: coordinate via in-app chat (chat feature TBD)
