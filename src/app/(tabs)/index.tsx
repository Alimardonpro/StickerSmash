import { SymbolView } from 'expo-symbols';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

const BasePhoto = require('@/assets/images/background-image.png');
const StickerJelly = require('@/assets/images/emoji1.png');
const StickerGlasses = require('@/assets/images/emoji4.png');
const StickerStar = require('@/assets/images/emoji3.png');

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

export default function DashboardScreen() {
  const { t } = useLanguage();
  const { colors } = useTheme();

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        router.push({
          pathname: '/editor',
          params: { initialUri: result.assets[0].uri },
        });
      }
    } catch {
      Alert.alert(t('permissionNeeded'), t('storagePermissionMsg'));
    }
  };

  const handleStartCreating = () => {
    router.push('/editor');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
      edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Minimal Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('dashboardTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('dashboardSubtitle')}
          </Text>
        </View>

        {/* Before & After Showcase */}
        <View style={styles.comparisonContainer}>
          {/* Card 1: Before (Original) */}
          <View style={[styles.showcaseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.badge, { backgroundColor: colors.surface2 }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                {t('originalPhoto')}
              </Text>
            </View>
            <View style={[styles.photoFrame, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
              <Image source={BasePhoto} style={styles.photo} contentFit="cover" />
            </View>
          </View>

          {/* Card 2: After (With Stickers) */}
          <View style={[styles.showcaseCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.accentText, fontWeight: '700' }]}>
                {t('withStickers')} ✨
              </Text>
            </View>
            <View style={[styles.photoFrame, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
              <Image source={BasePhoto} style={styles.photo} contentFit="cover" />

              {/* Decorative Stickers demonstrating the app */}
              <Image
                source={StickerGlasses}
                style={[
                  styles.stickerGlasses,
                  { width: CARD_WIDTH * 0.45, height: CARD_WIDTH * 0.25 },
                ]}
                contentFit="contain"
              />
              <Image
                source={StickerJelly}
                style={[
                  styles.stickerJelly,
                  { width: CARD_WIDTH * 0.32, height: CARD_WIDTH * 0.32 },
                ]}
                contentFit="contain"
              />
              <Image
                source={StickerStar}
                style={[
                  styles.stickerStar,
                  { width: CARD_WIDTH * 0.26, height: CARD_WIDTH * 0.26 },
                ]}
                contentFit="contain"
              />
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {t('howItWorks')}
          </Text>

          <View style={styles.stepItem}>
            <View style={[styles.stepIconBox, { backgroundColor: colors.surface2 }]}>
              <SymbolView
                name={{ ios: 'photo.on.rectangle', android: 'image', web: 'image' }}
                size={20}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {t('step1Title')}
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                {t('step1Desc')}
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepIconBox, { backgroundColor: colors.surface2 }]}>
              <SymbolView
                name={{ ios: 'wand.and.stars', android: 'auto_awesome', web: 'auto_awesome' }}
                size={20}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {t('step2Title')}
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                {t('step2Desc')}
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepIconBox, { backgroundColor: colors.surface2 }]}>
              <SymbolView
                name={{ ios: 'arrow.down.to.line', android: 'save', web: 'save' }}
                size={20}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {t('step3Title')}
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                {t('step3Desc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.85}
            onPress={handleStartCreating}>
            <SymbolView
              name={{ ios: 'wand.and.stars', android: 'auto_awesome', web: 'auto_awesome' }}
              size={18}
              tintColor={colors.accentText}
            />
            <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>
              {t('startCreating')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={handlePickPhoto}>
            <SymbolView
              name={{ ios: 'photo', android: 'image', web: 'image' }}
              size={18}
              tintColor={colors.text}
            />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              {t('choosePhotoBtn')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '400',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  showcaseCard: {
    borderRadius: 16,
    padding: 6,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  photoFrame: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  stickerGlasses: {
    position: 'absolute',
    top: '22%',
    left: '26%',
  },
  stickerJelly: {
    position: 'absolute',
    bottom: '12%',
    left: '8%',
  },
  stickerStar: {
    position: 'absolute',
    top: '10%',
    right: '8%',
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
  },
  stepDivider: {
    paddingLeft: 20,
    marginVertical: 10,
  },
  dividerLine: {
    width: 2,
    height: 12,
    borderRadius: 1,
  },
  actionsContainer: {
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
