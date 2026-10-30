import { NativeTabs } from 'expo-router/native-tabs';
import { useLanguage } from '@/context/language-context';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <NativeTabs tintColor="#ffd33d">
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
