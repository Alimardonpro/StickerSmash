import { SymbolView } from 'expo-symbols';
import * as Sharing from 'expo-sharing';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  deleteCreation,
  getSavedCreations,
  type CreationItem,
} from '@/services/storage';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function CreationsScreen() {
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CreationItem | null>(null);

  const loadCreations = useCallback(() => {
    getSavedCreations().then(setCreations);
  }, []);

  useFocusEffect(loadCreations);

  const handleDelete = (item: CreationItem) => {
    Alert.alert(t('deleteConfirmTitle'), t('deleteConfirmMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteCreation(item.id);
          setSelectedItem(null);
          loadCreations();
        },
      },
    ]);
  };

  const handleShare = async (item: CreationItem) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(item.uri);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
      edges={['top', 'left', 'right']}>
      {/* Minimal Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{t('tabCreations')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {creations.length} {t('itemsCount')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: colors.accent }]}
          activeOpacity={0.8}
          onPress={() => router.push('/')}>
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            size={16}
            tintColor={colors.accentText}
          />
        </TouchableOpacity>
      </View>

      {/* Grid or Empty State */}
      {creations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
            <SymbolView
              name={{ ios: 'photo.stack', android: 'collections', web: 'collections' }}
              size={36}
              tintColor={colors.textSecondary}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {t('emptyGalleryTitle')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {t('emptyGallerySubtitle')}
          </Text>
          <TouchableOpacity
            style={[styles.goToStudioBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() => router.push('/')}>
            <Text style={[styles.goToStudioBtnText, { color: colors.text }]}>
              {t('goToStudio')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={creations}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => setSelectedItem(item)}>
              <Image source={{ uri: item.uri }} style={styles.thumbnail} contentFit="cover" />
              <View style={styles.cardFooter}>
                <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => handleDelete(item)}>
                  <SymbolView
                    name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                    size={16}
                    tintColor={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Fullscreen Preview Modal */}
      {selectedItem && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedItem(null)}>
          <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedItem(null)}>
                <SymbolView
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={20}
                  tintColor="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: selectedItem.uri }}
                style={styles.modalImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: '#FFFFFF' }]}
                onPress={() => handleShare(selectedItem)}>
                <SymbolView
                  name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                  size={18}
                  tintColor="#000000"
                />
                <Text style={styles.shareBtnText}>{t('share')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}
                onPress={() => handleDelete(selectedItem)}>
                <SymbolView
                  name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                  size={18}
                  tintColor={colors.danger}
                />
                <Text style={[styles.shareBtnText, { color: colors.danger }]}>
                  {t('delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  newBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },
  columnWrapper: {
    gap: 16,
  },
  card: {
    width: COLUMN_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  thumbnail: {
    width: '100%',
    height: COLUMN_WIDTH * 1.3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  goToStudioBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  goToStudioBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
