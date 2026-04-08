import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/theme/ThemeContext";

const notifications = [
  {
    id: "1",
    title: "Lixeira crítica na Praça Central",
    description: "Nível de ocupação acima de 90%. Priorizar coleta.",
    type: "danger",
    time: "08:15",
  },
  {
    id: "2",
    title: "Rota Centro 01 atualizada",
    description: "Nova ordem de atendimento enviada para a equipe.",
    type: "info",
    time: "08:32",
  },
  {
    id: "3",
    title: "Coleta registrada com sucesso",
    description: "Rodoviária foi marcada como coletada.",
    type: "success",
    time: "09:05",
  },
];

function getNotificationColor(type: string, colors: any) {
  if (type === "danger") return colors.danger;
  if (type === "info") return colors.info;
  return colors.accent;
}

function getNotificationIcon(type: string) {
  if (type === "danger") return "alert-circle";
  if (type === "info") return "information-circle";
  return "checkmark-circle";
}

export default function NotificacoesScreen() {
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Avisos</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Atualizações importantes para a operação do dia.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const accentColor = getNotificationColor(item.type, colors);

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Ionicons
                  name={getNotificationIcon(item.type)}
                  size={22}
                  color={accentColor}
                />

                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.cardDescription, { color: colors.textMuted }]}
                  >
                    {item.description}
                  </Text>
                </View>

                <Text style={[styles.time, { color: colors.textMuted }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhum aviso no momento
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              As novas atualizações aparecerão aqui.
            </Text>
          </View>
        }
      />
    </View>
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
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
  },
});
