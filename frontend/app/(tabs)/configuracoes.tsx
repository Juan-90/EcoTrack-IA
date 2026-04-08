import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { AppThemeName, themes } from "@/src/theme/palettes";

const themeOptions: AppThemeName[] = ["dark", "light", "eco"];

export default function ConfiguracoesScreen() {
  const { theme, themeName, setThemeName } = useAppTheme();
  const { colors } = theme;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Personalize a aparência e acesse opções do aplicativo.
        </Text>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tema do aplicativo
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
          Escolha a paleta visual mais confortável para a operação.
        </Text>

        <View style={styles.themeList}>
          {themeOptions.map((option) => {
            const optionTheme = themes[option];
            const selected = option === themeName;

            return (
              <Pressable
                key={option}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: optionTheme.colors.card,
                    borderColor: selected
                      ? optionTheme.colors.accent
                      : optionTheme.colors.border,
                  },
                ]}
                onPress={() => setThemeName(option)}
              >
                <View style={styles.themePreviewRow}>
                  <View
                    style={[
                      styles.previewSwatch,
                      { backgroundColor: optionTheme.colors.bg },
                    ]}
                  />
                  <View
                    style={[
                      styles.previewSwatch,
                      { backgroundColor: optionTheme.colors.card },
                    ]}
                  />
                  <View
                    style={[
                      styles.previewSwatch,
                      { backgroundColor: optionTheme.colors.accent },
                    ]}
                  />
                </View>

                <View style={styles.themeInfo}>
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: optionTheme.colors.text },
                    ]}
                  >
                    {optionTheme.label}
                  </Text>

                  {selected ? (
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: optionTheme.colors.accent },
                      ]}
                    >
                      <Text style={styles.selectedBadgeText}>Ativo</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Conta
        </Text>

        <Pressable
          style={[styles.rowButton, { borderColor: colors.border }]}
          onPress={() => router.push("/perfil")}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="person-circle-outline" size={20} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  themeList: {
    gap: 12,
  },
  themeCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
  },
  themePreviewRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  previewSwatch: {
    width: 28,
    height: 28,
    borderRadius: 999,
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: "800",
  },
  selectedBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  rowButton: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
