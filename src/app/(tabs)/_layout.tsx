import { NativeTabs } from 'expo-router/native-tabs';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

export default function TabLayout() {
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.accent}
      indicatorColor={isDark ? 'rgba(255, 211, 61, 0.18)' : 'rgba(245, 158, 11, 0.15)'}
      rippleColor={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
      iconColor={{
        default: colors.textSecondary,
        selected: colors.accent,
      }}
      labelStyle={{
        default: { color: colors.textSecondary, fontSize: 11, fontWeight: '500' },
        selected: { color: colors.accent, fontSize: 11, fontWeight: '700' },
      }}
      labelVisibilityMode="labeled">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('tabHome')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="editor">
        <NativeTabs.Trigger.Label>{t('tabStudio')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'wand.and.stars', selected: 'wand.and.stars.inverse' }}
          md="auto_awesome"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="creations">
        <NativeTabs.Trigger.Label>{t('tabCreations')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'photo.stack', selected: 'photo.stack.fill' }}
          md="collections"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Label>{t('tabSettings')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'info.circle', selected: 'info.circle.fill' }}
          md="info"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
