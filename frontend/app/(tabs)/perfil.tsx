import { useContext } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "@/src/store/AuthContext";
import { useAppTheme } from "@/src/theme/ThemeContext";

export default function PerfilScreen() {
  const { signOut } = useContext(AuthContext);
  const { theme } = useAppTheme();
  const { colors } = theme;

  async function handleLogout() {
    Alert.alert("Sair do aplicativo", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>EC</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>Equipe de Coleta</Text>
        <Text style={[styles.role, { color: colors.textMuted }]}>
          Operação urbana • EcoTrack-IA Mobile
        </Text>
      </View>

      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Informações de uso
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Este aplicativo foi desenhado para apoiar o trabalho diário da equipe de coleta.
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Use as abas para acompanhar coletas, mapa, avisos e ajustes operacionais.
        </Text>
      </View>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: colors.danger }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </Pressable>
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
  profileCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  role: {
    fontSize: 14,
    textAlign: "center",
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoLine: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
