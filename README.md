# StickerSmash 🎨✨

[![CI/CD Pipeline](https://github.com/Alimardonpro/StickerSmash/actions/workflows/ci.yml/badge.svg)](https://github.com/Alimardonpro/StickerSmash/actions/workflows/ci.yml)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-58.0-000000.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg)
![Version](https://img.shields.io/badge/Version-1.0.1-brightgreen.svg)

> Modern, universal photo sticker studio built with **Expo SDK 58**, **React Native 0.88**, and **Expo Router**. Runs seamlessly on **Android**, **iOS**, and **Web**.

---

## 📱 Yuklab olish va Jonli Veb-versiya

- 🌐 **Jonli Veb-versiya (Live Web Deployment)**: [https://alimardon23-stickersmash.expo.app](https://alimardon23-stickersmash.expo.app)
- 📲 **To'g'ridan-to'g'ri APK yuklab olish (v1.0.1)**: [Yuklab olish (Direct APK)](https://expo.dev/artifacts/eas/3fVGZe1joor0-HsEFB2I3Ol4fKBOUTyLzWDd1oVeVeM.apk)
- 🚀 **EAS Build sahifasi**: [EAS Build Details](https://expo.dev/accounts/alimardon23/projects/stickersmash/builds/a241f4bb-c586-4a3a-b1bd-fbadbdcdbd7c)

---

## 🌟 Asosiy imkoniyatlar (Key Features)

1. **Studiyada rasmlarni tahrirlash (Photo Studio & Canvas)**:
   - Kamera yoki galereyadan rasm yuklash
   - Stikerlarni sudrab olib o'tish (Drag & Drop), kattalashtirish (Pinch to Zoom) va aylantirish (Rotate)
   - Yuqori sifatli eksport (`react-native-view-shot` + `expo-media-library` / `expo-sharing`)

2. **iOS & Android Liquid Glass Floating Tab Bar**:
   - `expo-blur` va `react-native-reanimated` yordamida yaratilgan zamonaviy muzlatilgan oyna (liquid glass pill) tab bar
   - Yumshoq animatsiyali aktiv indikator kapsulasi

3. **Ko'p tilli interfeys (Multi-language Support)**:
   - 🇺🇿 O'zbekcha
   - 🇷🇺 Русский
   - 🇯🇵 日本語
   - 🇺🇸 English

4. **Tungi va Kunduzgi rejim (Dark / Light Theme)**:
   - To'liq dinamik qora (AMOLED) va oq mavzu qo'llab-quvvatlanadi

5. **Android Lifecycle & Camera Stability**:
   - Android-da kamera ochilganda xotira kamligi sababli dastur qayta yuklansa ham rasmni saqlab qoluvchi `ImagePicker.getPendingResultAsync()` integratsiyasi

6. **Web va Universal platforma qo'llab-quvvatlovi**:
   - `npx expo export -p web` orqali to'liq veb-versiyaga eksport qilinadi va brauzerda ishlaydi

7. **CI/CD Quvuri (GitHub Actions)**:
   - Har bir `push` va `PR` da avtomatik TypeScript tekshiruvi (`tsc --noEmit`), `expo-doctor` tekshiruvi va Web versiyasini yig'ish (`dist`) amalga oshiriladi

---

## 🛠 Ishga tushirish (Local Setup)

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Loyihani ishga tushirish
npx expo start

# 3. Web rejimida ko'rish
npx expo start --web

# 4. TypeScript va konfiguratsiyani tekshirish
npx tsc --noEmit
npx expo-doctor
```

---

## 🚀 EAS Build & CI/CD

```bash
# Android APK (preview profilida) yaratish
eas build -p android --profile preview

# iOS Simulator uchun yig'ish
eas build -p ios --profile preview
```
