import { SymbolView } from 'expo-symbols';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import CanvasSticker, { type CanvasStickerItem } from '@/components/canvas-sticker';
import EmojiPicker from '@/components/emoji-picker';
import ImageViewer from '@/components/image-viewer';
import type { StickerData } from '@/constants/stickers';
import { saveCreation } from '@/services/storage';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

const PlaceholderImage = require('@/assets/images/background-image.png');
const { width } = Dimensions.get('window');

const CANVAS_WIDTH = Math.min(width - 48, 330);
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * 1.35);

export default function StudioScreen() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ initialUri?: string }>();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    params.initialUri
  );
  const [stickers, setStickers] = useState<CanvasStickerItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<ComponentRef<typeof View>>(null);

  useEffect(() => {
    if (params.initialUri) {
      setSelectedImage(params.initialUri);
    }
  }, [params.initialUri]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert(t('permissionNeeded'), t('storagePermissionMsg'));
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('permissionNeeded'), t('cameraPermissionMsg'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert(t('permissionNeeded'), t('cameraPermissionMsg'));
    }
  };

  const handleOpenPhotoMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            t('cancel'),
            t('fromGallery'),
            t('fromCamera'),
            t('defaultPhoto'),
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handlePickImage();
          } else if (buttonIndex === 2) {
            handleTakePhoto();
          } else if (buttonIndex === 3) {
            setSelectedImage(undefined);
          }
        }
      );
    } else {
      Alert.alert(t('changePhoto'), undefined, [
        { text: t('cancel'), style: 'cancel' },
        { text: t('fromGallery'), onPress: handlePickImage },
        { text: t('fromCamera'), onPress: handleTakePhoto },
        { text: t('defaultPhoto'), onPress: () => setSelectedImage(undefined) },
      ]);
    }
  };

  const handleAddSticker = (stickerData: StickerData) => {
    const newSticker: CanvasStickerItem = {
      id: Date.now().toString(),
      data: stickerData,
      x: CANVAS_WIDTH / 2 - 35,
      y: CANVAS_HEIGHT / 2 - 35,
      size: 70,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleDeleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleResetCanvas = () => {
    if (stickers.length === 0 && !selectedImage) return;

    Alert.alert(t('resetConfirmTitle'), t('resetConfirmMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm'),
        style: 'destructive',
        onPress: () => {
          setStickers([]);
          setSelectedImage(undefined);
          setSelectedStickerId(null);
        },
      },
    ]);
  };

  const handleSaveImage = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSelectedStickerId(null);

    try {
      const localUri = await captureRef(imageRef, {
        format: 'png',
        quality: 1,
      });

      await saveCreation({
        uri: localUri,
        stickersCount: stickers.length,
      });

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.download = 'stickersmash.png';
        link.href = localUri;
        link.click();
        Alert.alert(t('savedSuccessTitle'), t('savedSuccessMsg'));
        setIsSaving(false);
        return;
      }

      let granted = permissionResponse?.granted;
      if (!granted) {
        const res = await requestPermission();
        granted = res?.granted;
      }

      if (granted) {
        try {
          if (MediaLibrary.createAssetAsync) {
            await MediaLibrary.createAssetAsync(localUri);
          } else if (MediaLibrary.saveToLibraryAsync) {
            await MediaLibrary.saveToLibraryAsync(localUri);
          }
        } catch {
          // Fallback handled below
        }

        Alert.alert(t('savedSuccessTitle'), t('savedSuccessMsg'), [
          { text: t('ok') },
          {
            text: t('share'),
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(localUri);
              }
            },
          },
        ]);
      } else {
        Alert.alert(t('permissionNeeded'), t('storagePermissionMsg'), [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('shareFallback'),
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(localUri);
              }
            },
          },
          {
            text: t('openSettings'),
            onPress: () => Linking.openSettings(),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert(t('save'), err?.message || 'Error saving image.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
      edges={['top', 'left', 'right']}>
      {/* Minimal Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tabStudio')}</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
            onPress={handleTakePhoto}>
            <SymbolView
              name={{ ios: 'camera', android: 'camera', web: 'camera' }}
              size={18}
              tintColor={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
            onPress={handlePickImage}>
            <SymbolView
              name={{ ios: 'photo', android: 'image', web: 'image' }}
              size={18}
              tintColor={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas Area with Change Photo Trigger */}
      <View style={styles.canvasContainer}>
        {/* Change Background Photo Pill Button */}
        <TouchableOpacity
          style={[
            styles.changePhotoPill,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          activeOpacity={0.75}
          onPress={handleOpenPhotoMenu}>
          <SymbolView
            name={{ ios: 'photo.badge.plus', android: 'add_photo_alternate', web: 'image' }}
            size={15}
            tintColor={colors.accent}
          />
          <Text style={[styles.changePhotoText, { color: colors.text }]}>
            {t('changePhoto')}
          </Text>
        </TouchableOpacity>

        <View
          ref={imageRef}
          collapsable={false}
          style={[
            styles.canvasFrame,
            {
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={selectedImage}
          />

          {stickers.map((sticker) => (
            <CanvasSticker
              key={sticker.id}
              sticker={sticker}
              isSelected={selectedStickerId === sticker.id}
              onSelect={setSelectedStickerId}
              onDelete={handleDeleteSticker}
              containerWidth={CANVAS_WIDTH}
              containerHeight={CANVAS_HEIGHT}
            />
          ))}
        </View>
      </View>

      {/* Minimal Bottom Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleResetCanvas}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface2 }]}>
            <SymbolView
              name={{ ios: 'arrow.counterclockwise', android: 'refresh', web: 'refresh' }}
              size={20}
              tintColor={colors.text}
            />
          </View>
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t('reset')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainActionBtn}
          activeOpacity={0.85}
          onPress={() => setIsPickerVisible(true)}>
          <View style={[styles.mainIconCircle, { backgroundColor: colors.accent }]}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={28}
              tintColor={colors.accentText}
            />
          </View>
          <Text style={[styles.actionLabel, { color: colors.text, fontWeight: '600' }]}>
            {t('addSticker')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          disabled={isSaving}
          onPress={handleSaveImage}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface2 }]}>
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <SymbolView
                name={{ ios: 'arrow.down.to.line', android: 'save', web: 'save' }}
                size={20}
                tintColor={colors.text}
              />
            )}
          </View>
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
            {isSaving ? t('saving') : t('save')}
          </Text>
        </TouchableOpacity>
      </View>

      <EmojiPicker
        isVisible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelectSticker={handleAddSticker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  changePhotoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  canvasFrame: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 84 : 70,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  mainActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    top: -4,
  },
  mainIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
