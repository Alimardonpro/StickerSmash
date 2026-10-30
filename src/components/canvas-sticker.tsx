import { SymbolView } from 'expo-symbols';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { StickerData } from '@/constants/stickers';

export type CanvasStickerItem = {
  id: string;
  data: StickerData;
  x: number;
  y: number;
  size: number;
};

type Props = {
  sticker: CanvasStickerItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  containerWidth: number;
  containerHeight: number;
};

export default function CanvasSticker({
  sticker,
  isSelected,
  onSelect,
  onDelete,
  containerWidth,
  containerHeight,
}: Props) {
  const scale = useSharedValue(sticker.size);
  const translateX = useSharedValue(sticker.x);
  const translateY = useSharedValue(sticker.y);

  const prevX = useSharedValue(sticker.x);
  const prevY = useSharedValue(sticker.y);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevX.value = translateX.value;
      prevY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = clamp(
        prevX.value + event.translationX,
        -scale.value / 2,
        containerWidth - scale.value / 2
      );
      translateY.value = clamp(
        prevY.value + event.translationY,
        -scale.value / 2,
        containerHeight - scale.value / 2
      );
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    onSelect(sticker.id);
  });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value > 60 ? 44 : 90;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, Gesture.Exclusive(doubleTapGesture, tapGesture));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: scale.value,
      height: scale.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          isSelected && styles.selectedContainer,
        ]}>
        {isSelected && (
          <TouchableOpacity
            style={styles.deleteBadge}
            onPress={() => onDelete(sticker.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'close' }}
              size={20}
              tintColor="#EF4444"
            />
          </TouchableOpacity>
        )}

        {sticker.data.type === 'image' ? (
          <Image
            source={sticker.data.source}
            style={styles.image}
            contentFit="contain"
          />
        ) : (
          <View style={styles.emojiContainer}>
            <Text style={{ fontSize: sticker.size * 0.7 }}>
              {sticker.data.text}
            </Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    borderWidth: 1.5,
    borderColor: '#FFD33D',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 211, 61, 0.1)',
  },
  deleteBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  emojiContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

