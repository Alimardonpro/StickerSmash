import { Tabs } from 'expo-router';
import LiquidGlassTabBar from '@/components/liquid-glass-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...(props as any)} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="editor" />
      <Tabs.Screen name="creations" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}
