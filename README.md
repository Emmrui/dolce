# Dolce 🛍️
> A mobile-first second-hand clothes marketplace for Israel — buy and sell with Bit payments.

---

## Prerequisites — install these first

| Tool | Why | Download |
|---|---|---|
| **Node.js** (v18+) | Runs the app | [nodejs.org](https://nodejs.org) |
| **Git** | Version control | [git-scm.com](https://git-scm.com) |
| **Expo Go** app | Preview on your phone | App Store / Google Play |

> You do NOT need to install Android Studio or Xcode. Expo Go is enough to run the app on your phone.

---

## Getting started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/dolce.git
cd dolce
```

### 2. Install dependencies
```bash
npm install
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/inter
```

### 3. Set up Firebase

Ask **Emma** to share the `.env` file with you directly (never commit this to GitHub).  
Place it at the root of the project. It looks like this:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run the app
```bash
npx expo start
```

A QR code will appear in the terminal. Scan it with:
- **iPhone** → Camera app
- **Android** → Expo Go app

The app will open on your phone instantly. Any code change you save will refresh it automatically.

---

## Project structure
```
dolce/
├── App.tsx                        # Entry point
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx    # Login page
│   │   │   └── SignUpScreen.tsx   # Sign up page
│   │   ├── buyer/
│   │   │   ├── ShopScreen.tsx     # Main feed — browse listings
│   │   │   └── ListingDetailScreen.tsx  # Item detail + Bit checkout
│   │   ├── seller/
│   │   │   └── SellScreen.tsx     # Create a new listing
│   │   └── shared/
│   │       └── ProfileScreen.tsx  # Profile — listings, purchases, mode toggle
│   ├── services/
│   │   ├── firebase.ts            # Firebase connection
│   │   ├── authService.ts         # Sign up / login / user management
│   │   └── listingsService.ts     # Create / fetch / update listings
│   ├── hooks/
│   │   └── useAuth.tsx            # Auth state shared across the app
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Screen routing
│   └── utils/
│       └── theme.ts               # Colors, fonts, spacing
```

---

## How the app works

- **One account** for both buying and selling — toggle between modes in your profile
- **Browse** listings by category, search by title or city
- **Sell** — upload photos, set price, choose delivery options
- **Pay with Bit** — tapping "Pay with bit" opens the Bit app pre-filled with the amount

---

## Payments — Bit

Bit is a peer-to-peer Israeli payment app. No backend needed — buyer opens Bit, pays the seller directly on their phone. The seller confirms receipt and marks the item as sold.

---

## Shipping options in Israel

| Option | How it works |
|---|---|
| **Courier** (iPost, Cargo) | Seller schedules pickup, buyer receives at home |
| **Pick-up point** | Drop off at Supersol / Ksp / Yellow, buyer collects nearby |
| **Self pickup** | Coordinate a meetup via chat |

---

## Common issues

**`npx expo start` fails**  
→ Make sure Node.js is installed: `node -v` should show v18 or higher

**App doesn't load on phone**  
→ Make sure your phone and computer are on the same WiFi network

**Firebase errors**  
→ Check that your `.env` file is at the root of the project and has no typos

---

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "describe what you did"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request on GitHub
