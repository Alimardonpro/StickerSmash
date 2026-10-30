import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
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
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerData) => void;
};

type Category = 'art' | 'emojis' | 'badges';

export default function EmojiPicker({
  isVisible,
  onClose,
  onSelectSticker,
}: Props) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Category>('art');

  const getActiveData = (): StickerData[] => {
    switch (activeTab) {
      case 'art':
        return IMAGE_STICKERS;
      case 'emojis':
        return EMOJI_STICKERS;
      case 'badges':
        return BADGE_STICKERS;
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
                  Art
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
                  Emoji
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
                  Badge
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stickers Grid */}
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
    height: '50%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
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
    fontSize: 12,
    fontWeight: '600',
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
    width: 42,
    height: 42,
    marginBottom: 4,
  },
  emojiText: {
    fontSize: 30,
    marginBottom: 4,
  },
  stickerName: {
    fontSize: 10,
    fontWeight: '500',
  },
});
