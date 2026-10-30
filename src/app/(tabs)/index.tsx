import { SymbolView } from 'expo-symbols';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
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
import type { TranslationKey } from '@/localization/translations';

const ModelPhoto = require('@/assets/images/model-photo.jpg');

// High-definition 3D Aesthetic Stickers
const StkButterfly = require('@/assets/images/stickers/butterfly.png');
const StkSparkles = require('@/assets/images/stickers/sparkles.png');
const StkBlossom = require('@/assets/images/stickers/cherry-blossom.png');
const StkCrown = require('@/assets/images/stickers/crown.png');
const StkHeart = require('@/assets/images/stickers/sparkling-heart.png');
const StkHeartsSmile = require('@/assets/images/stickers/hearts-smile.png');
const StkCoolSmile = require('@/assets/images/stickers/cool-smile.png');
const StkPartySmile = require('@/assets/images/stickers/party-smile.png');
const StkStar = require('@/assets/images/stickers/star.png');
const StkRibbon = require('@/assets/images/stickers/ribbon.png');

const { width } = Dimensions.get('window');
const CAROUSEL_CARD_WIDTH = Math.round(width * 0.74);
const CAROUSEL_CARD_HEIGHT = Math.round(CAROUSEL_CARD_WIDTH * 1.35);

type FilterCategory = 'all' | 'portrait' | 'fun' | 'party' | 'art';

type ShowcaseItem = {
  id: string;
  category: 'portrait' | 'fun' | 'party' | 'art';
  titleKey: TranslationKey;
  descKey: TranslationKey;
  tag: string;
  stickers: {
    source: any;
    top?: `${number}%` | number;
    bottom?: `${number}%` | number;
    left?: `${number}%` | number;
    right?: `${number}%` | number;
    widthPercent: number;
    heightPercent: number;
  }[];
};

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'res-1',
    category: 'portrait',
    titleKey: 'cardResult1Title',
    descKey: 'cardResult1Desc',
    tag: '🦋 Aesthetic',
    stickers: [
      { source: StkButterfly, bottom: '20%', left: '8%', widthPercent: 0.32, heightPercent: 0.32 },
      { source: StkSparkles, top: '10%', right: '10%', widthPercent: 0.28, heightPercent: 0.28 },
      { source: StkStar, top: '22%', left: '10%', widthPercent: 0.22, heightPercent: 0.22 },
    ],
  },
  {
    id: 'res-2',
    category: 'art',
    titleKey: 'cardResult2Title',
    descKey: 'cardResult2Desc',
    tag: '👑 Princess Glow',
    stickers: [
      { source: StkCrown, top: '4%', left: '36%', widthPercent: 0.3, heightPercent: 0.22 },
      { source: StkBlossom, top: '20%', right: '12%', widthPercent: 0.26, heightPercent: 0.26 },
      { source: StkSparkles, bottom: '22%', right: '10%', widthPercent: 0.24, heightPercent: 0.24 },
    ],
  },
  {
    id: 'res-3',
    category: 'fun',
    titleKey: 'cardResult3Title',
    descKey: 'cardResult3Desc',
    tag: '🥰 Lovely Sweet',
    stickers: [
      { source: StkHeartsSmile, bottom: '18%', right: '8%', widthPercent: 0.3, heightPercent: 0.3 },
      { source: StkHeart, top: '12%', left: '10%', widthPercent: 0.26, heightPercent: 0.26 },
      { source: StkRibbon, bottom: '22%', left: '10%', widthPercent: 0.25, heightPercent: 0.25 },
    ],
  },
  {
    id: 'res-4',
    category: 'party',
    titleKey: 'cardResult4Title',
    descKey: 'cardResult4Desc',
    tag: '🎉 Festive Joy',
    stickers: [
      { source: StkPartySmile, top: '10%', right: '8%', widthPercent: 0.3, heightPercent: 0.3 },
      { source: StkCoolSmile, bottom: '18%', left: '8%', widthPercent: 0.28, heightPercent: 0.28 },
      { source: StkStar, top: '8%', left: '12%', widthPercent: 0.24, heightPercent: 0.24 },
    ],
  },
];

export default function DashboardScreen() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return SHOWCASE_ITEMS;
    return SHOWCASE_ITEMS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('dashboardTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('dashboardSubtitle')}
          </Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('resultsShowcase')}
          </Text>
        </View>

        {/* Filter Buttons in a Smooth Horizontal ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterContainer}>
          {(['all', 'portrait', 'fun', 'party', 'art'] as FilterCategory[]).map((cat) => {
            const isSelected = activeFilter === cat;
            const filterLabel =
              cat === 'all'
                ? t('filterAll')
                : cat === 'portrait'
                ? t('filterPortrait')
                : cat === 'fun'
                ? t('filterFun')
                : cat === 'party'
                ? t('filterParty')
                : t('filterArt');

            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(cat)}>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? colors.accentText : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {filterLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Large Horizontal Results Carousel */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.carouselList}
          snapToInterval={CAROUSEL_CARD_WIDTH + 16}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.carouselCard,
                {
                  width: CAROUSEL_CARD_WIDTH,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.9}
              onPress={handleStartCreating}>
              {/* Photo Frame with Girl's Photo & 3D Aesthetic Stickers */}
              <View
                style={[
                  styles.cardMediaContainer,
                  { height: CAROUSEL_CARD_HEIGHT },
                ]}>
                <Image source={ModelPhoto} style={styles.cardImage} contentFit="cover" />

                {/* Floating Tag */}
                <View style={styles.cardTagBadge}>
                  <Text style={styles.cardTagText}>{item.tag}</Text>
                </View>

                {/* Layered Result 3D Stickers */}
                {item.stickers.map((stk, idx) => (
                  <Image
                    key={idx}
                    source={stk.source}
                    style={{
                      position: 'absolute',
                      top: stk.top,
                      bottom: stk.bottom,
                      left: stk.left,
                      right: stk.right,
                      width: CAROUSEL_CARD_WIDTH * stk.widthPercent,
                      height: CAROUSEL_CARD_WIDTH * stk.heightPercent,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                    }}
                    contentFit="contain"
                  />
                ))}
              </View>

              {/* Card Meta / Caption */}
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                  {t(item.titleKey)}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {t(item.descKey)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Detailed Explanation / Project Purpose (Below the Carousel) */}
        <View style={styles.articlesContainer}>
          {/* Mission & Purpose Card */}
          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconPill, { backgroundColor: colors.surface2 }]}>
                <SymbolView
                  name={{ ios: 'target', android: 'track_changes', web: 'flag' }}
                  size={20}
                  tintColor={colors.accent}
                />
              </View>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                {t('projectGoalTitle')}
              </Text>
            </View>
            <Text style={[styles.detailCardBody, { color: colors.textSecondary }]}>
              {t('projectGoalText')}
            </Text>
          </View>

          {/* How App Works Card */}
          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconPill, { backgroundColor: colors.surface2 }]}>
                <SymbolView
                  name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                  size={20}
                  tintColor={colors.accent}
                />
              </View>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                {t('howItWorksTitle')}
              </Text>
            </View>
            <Text style={[styles.detailCardBody, { color: colors.textSecondary }]}>
              {t('howItWorksText')}
            </Text>
          </View>

          {/* Key Advantages Grid */}
          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.accent }]} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureItemTitle, { color: colors.text }]}>
                  {t('feature1Title')}
                </Text>
                <Text style={[styles.featureItemDesc, { color: colors.textSecondary }]}>
                  {t('feature1Desc')}
                </Text>
              </View>
            </View>

            <View style={[styles.featureDivider, { backgroundColor: colors.border }]} />

            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.accent }]} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureItemTitle, { color: colors.text }]}>
                  {t('feature2Title')}
                </Text>
                <Text style={[styles.featureItemDesc, { color: colors.textSecondary }]}>
                  {t('feature2Desc')}
                </Text>
              </View>
            </View>

            <View style={[styles.featureDivider, { backgroundColor: colors.border }]} />

            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: colors.accent }]} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureItemTitle, { color: colors.text }]}>
                  {t('feature3Title')}
                </Text>
                <Text style={[styles.featureItemDesc, { color: colors.textSecondary }]}>
                  {t('feature3Desc')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
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
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
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
  sectionHeaderRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  filterContainer: {
    marginBottom: 14,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
  carouselList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 8,
  },
  carouselCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  cardMediaContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cardTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 14,
    minHeight: 76,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  articlesContainer: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 14,
  },
  detailCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconPill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    letterSpacing: -0.2,
  },
  detailCardBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  featureContent: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureItemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  featureDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
    marginLeft: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
