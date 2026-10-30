import { SymbolView } from 'expo-symbols';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import type { Language } from '@/localization/translations';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleClearHistory = () => {
    Alert.alert(t('clearCreations'), t('clearConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@sticker_smash_creations');
          Alert.alert(t('ok'), t('clearedSuccess'));
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
      edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('settingsTitle')}</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          {t('appearance')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <SymbolView
                name={{ ios: 'moon.stars', android: 'dark_mode', web: 'dark_mode' }}
                size={20}
                tintColor={colors.text}
              />
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                {t('darkMode')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surface2, true: colors.accent }}
              thumbColor={isDark ? '#FFFFFF' : '#F4F4F5'}
            />
          </View>
        </View>

        {/* Language Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          {t('languageSection')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {LANGUAGES.map((item, index) => {
            const isSelected = language === item.code;
            const isLast = index === LANGUAGES.length - 1;

            return (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.langRow,
                  !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
                activeOpacity={0.7}
                onPress={() => setLanguage(item.code)}>
                <Text
                  style={[
                    styles.langLabel,
                    { color: isSelected ? colors.text : colors.textSecondary },
                    isSelected && styles.selectedLangLabel,
                  ]}>
                  {item.label}
                </Text>

                {isSelected && (
                  <SymbolView
                    name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    size={18}
                    tintColor={colors.accent}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Storage Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          {t('storageSection')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.7}
            onPress={handleClearHistory}>
            <View style={styles.rowLeft}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={18}
                tintColor={colors.danger}
              />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>
                {t('clearCreations')}
              </Text>
            </View>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              tintColor={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Minimal Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            StickerSmash • {t('version')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  langLabel: {
    fontSize: 15,
  },
  selectedLangLabel: {
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
});
