import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  BADGE_STICKERS,
  EMOJI_STICKERS,
  IMAGE_STICKERS,
  type StickerData,
} from '@/constants/stickers';
import {
  fetchLiveEmojis,
  type EmojiApiCategory,
} from '@/services/emoji-api';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerData) => void;
};

type Category = 'art' | 'emojis' | 'badges' | 'api';

const API_CATEGORIES: { id: EmojiApiCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'smileys-and-people', label: 'Smileys' },
  { id: 'animals-and-nature', label: 'Animals' },
  { id: 'food-and-drink', label: 'Food' },
  { id: 'objects', label: 'Objects' },
  { id: 'symbols', label: 'Symbols' },
];

export default function EmojiPicker({
  isVisible,
  onClose,
  onSelectSticker,
}: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Category>('art');

  // Live API State
  const [apiEmojis, setApiEmojis] = useState<StickerData[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [selectedApiCategory, setSelectedApiCategory] =
    useState<EmojiApiCategory>('all');

  const loadApiData = async (cat: EmojiApiCategory = selectedApiCategory) => {
    setIsLoadingApi(true);
    const data = await fetchLiveEmojis(cat);
    setApiEmojis(data);
    setIsLoadingApi(false);
  };

  useEffect(() => {
    if (activeTab === 'api' && apiEmojis.length === 0) {
      loadApiData('all');
    }
  }, [activeTab]);

  const getActiveData = (): StickerData[] => {
    switch (activeTab) {
      case 'art':
        return IMAGE_STICKERS;
      case 'emojis':
        return EMOJI_STICKERS;
      case 'badges':
        return BADGE_STICKERS;
      case 'api':
        return apiEmojis;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={[styles.handle, { backgroundColor: colors.surface2 }]} />
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>{t('selectSticker')}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <SymbolView
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={16}
                  tintColor={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Segmented Category Filter */}
            <View style={[styles.tabContainer, { backgroundColor: colors.surface2 }]}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'art' && { backgroundColor: colors.card }]}
                onPress={() => setActiveTab('art')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === 'art' ? colors.text : colors.textSecondary },
                  ]}>
                  {t('tab3dArt')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'emojis' && { backgroundColor: colors.card }]}
                onPress={() => setActiveTab('emojis')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === 'emojis' ? colors.text : colors.textSecondary },
                  ]}>
                  {t('tabEmojis')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'badges' && { backgroundColor: colors.card }]}
                onPress={() => setActiveTab('badges')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === 'badges' ? colors.text : colors.textSecondary },
                  ]}>
                  {t('tabBadges')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'api' && { backgroundColor: colors.card }]}
                onPress={() => setActiveTab('api')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === 'api' ? colors.accent : colors.textSecondary },
                    activeTab === 'api' && { fontWeight: '700' },
                  ]}>
                  {t('tabOnlineApi')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sub-bar for Live API Categories */}
            {activeTab === 'api' && (
              <View style={styles.apiCategoryBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.apiCategoryScroll}>
                  {API_CATEGORIES.map((cat) => {
                    const isSelected = selectedApiCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.apiChip,
                          {
                            backgroundColor: isSelected ? colors.accent : colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() => {
                          setSelectedApiCategory(cat.id);
                          loadApiData(cat.id);
                        }}>
                        <Text
                          style={[
                            styles.apiChipText,
                            {
                              color: isSelected ? colors.accentText : colors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={[styles.apiRefreshBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => loadApiData(selectedApiCategory)}>
                    <SymbolView
                      name={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
                      size={14}
                      tintColor={colors.accent}
                    />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          {/* Stickers / Emojis Grid or Loader */}
          {activeTab === 'api' && isLoadingApi ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
                {t('loadingApi')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={getActiveData()}
              numColumns={4}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.stickerItem, { backgroundColor: colors.surface2, borderColor: colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectSticker(item);
                    onClose();
                  }}>
                  {item.type === 'image' ? (
                    <Image
                      source={item.source}
                      style={styles.stickerImage}
                      contentFit="contain"
                    />
                  ) : (
                    <Text style={styles.emojiText}>{item.text}</Text>
                  )}
                  <Text
                    style={[styles.stickerName, { color: colors.textSecondary }]}
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    height: '56%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  apiCategoryBar: {
    marginTop: 10,
  },
  apiCategoryScroll: {
    gap: 6,
    alignItems: 'center',
  },
  apiChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  apiChipText: {
    fontSize: 11,
  },
  apiRefreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
  },
  listContent: {
    padding: 14,
    gap: 8,
  },
  stickerItem: {
    flex: 1 / 4,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    padding: 6,
    borderWidth: 1,
  },
  stickerImage: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  emojiText: {
    fontSize: 32,
    marginBottom: 4,
  },
  stickerName: {
    fontSize: 10,
    fontWeight: '500',
  },
});
