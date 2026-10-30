import { SymbolView } from 'expo-symbols';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

export type CustomTabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: any }>;
  };
  descriptors: Record<string, { options: any }>;
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: any) => void;
  };
};

const TAB_CONFIG: Record<
  string,
  {
    translationKey: 'tabHome' | 'tabStudio' | 'tabCreations' | 'tabSettings';
    sf: { default: string; selected: string };
    md: string;
  }
> = {
  index: {
    translationKey: 'tabHome',
    sf: { default: 'house', selected: 'house.fill' },
    md: 'home',
  },
  editor: {
    translationKey: 'tabStudio',
    sf: { default: 'wand.and.stars', selected: 'wand.and.stars.inverse' },
    md: 'auto_awesome',
  },
  creations: {
    translationKey: 'tabCreations',
    sf: { default: 'photo.stack', selected: 'photo.stack.fill' },
    md: 'collections',
  },
  about: {
    translationKey: 'tabSettings',
    sf: { default: 'info.circle', selected: 'info.circle.fill' },
    md: 'info',
  },
};

const { width: screenWidth } = Dimensions.get('window');
const BAR_MAX_WIDTH = Math.min(screenWidth - 32, 420);
const BAR_HEIGHT = 62;
const INDICATOR_HEIGHT = 48;

export default function LiquidGlassTabBar({
  state,
  navigation,
}: CustomTabBarProps) {
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();

  const [containerWidth, setContainerWidth] = useState(BAR_MAX_WIDTH);
  const tabWidth = containerWidth / Math.max(state.routes.length, 1);

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 18,
      stiffness: 220,
      mass: 0.65,
    });
  }, [state.index, tabWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - containerWidth) > 1) {
      setContainerWidth(w);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: Math.max(tabWidth - 8, 20),
      transform: [{ translateX: translateX.value + 4 }],
    };
  });

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <View
        onLayout={onLayout}
        style={[
          styles.barWrapper,
          {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.16)'
              : 'rgba(0, 0, 0, 0.08)',
            shadowOpacity: isDark ? 0.45 : 0.14,
          },
        ]}>
        {/* Frosted Glass Blur Background */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 70 : 85}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Translucent Liquid Glass Tint Overlay */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? 'rgba(26, 28, 34, 0.76)'
                : 'rgba(255, 255, 255, 0.78)',
            },
          ]}
        />

        {/* Animated Sliding Pill Capsule (Liquid Glass Pill) */}
        <Animated.View
          style={[
            styles.slidingPill,
            indicatorStyle,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(0, 0, 0, 0.07)',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        />

        {/* Tab Items */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name] || {
              translationKey: 'tabHome' as const,
              sf: { default: 'circle', selected: 'circle.fill' },
              md: 'circle',
            };

            const label = t(config.translationKey);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const iconTint = isFocused
              ? colors.accent
              : isDark
              ? 'rgba(255, 255, 255, 0.55)'
              : 'rgba(0, 0, 0, 0.55)';

            const textTint = isFocused
              ? colors.accent
              : isDark
              ? 'rgba(255, 255, 255, 0.60)'
              : 'rgba(0, 0, 0, 0.60)';

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.7}
                onPress={onPress}
                style={styles.tabButton}>
                <SymbolView
                  name={{
                    ios: (isFocused ? config.sf.selected : config.sf.default) as any,
                    android: config.md as any,
                    web: config.md as any,
                  }}
                  size={21}
                  tintColor={iconTint}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: textTint,
                      fontWeight: isFocused ? '700' : '500',
                    },
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  barWrapper: {
    width: BAR_MAX_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
    justifyContent: 'center',
  },
  slidingPill: {
    position: 'absolute',
    top: 7,
    height: INDICATOR_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: -0.2,
  },
});
