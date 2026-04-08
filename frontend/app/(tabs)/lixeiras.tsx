import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { getBins } from "@/src/services/binService";
import { Bin } from "@/src/types/bin";
import { useAppTheme } from "@/src/theme/ThemeContext";

function getStatusLabel(status: Bin["status"]) {
  if (status === "critical") return "Prioridade alta";
  if (status === "warning") return "Atenção";
  if (status === "collected") return "Coletada";
  return "Normal";
}

function getStatusColor(status: Bin["status"], colors: any) {
  if (status === "critical") return colors.danger;
  if (status === "warning") return colors.warning;
  if (status === "collected") return colors.accent;
  return colors.accentHover;
}

export default function LixeirasScreen() {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const [bins, setBins] = useState<Bin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBinsData = useCallback(async () => {
    const data = await getBins();
    setBins(data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await loadBinsData();
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadBinsData]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadBinsData();
    setIsRefreshing(false);
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.accent]}
            progressBackgroundColor={colors.card}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Coletas do dia
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Priorize lixeiras com maior nível de ocupação.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusColor = getStatusColor(item.status, colors);

          return (
            <Pressable
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => router.push(`/lixeira/${item.id}`)}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.meta, { color: colors.textMuted }]}>
                    {item.district} • {item.routeName || "Rota do dia"}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: statusColor }]}>
                  <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.level}%`,
                        backgroundColor: statusColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.level, { color: colors.text }]}>
                  {item.level}%
                </Text>
              </View>

              <Text style={[styles.updatedText, { color: colors.textMuted }]}>
                Atualizada em{" "}
                {new Date(item.updatedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { marginBottom: 16 },
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
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
  },
  level: {
    width: 42,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "800",
  },
  updatedText: {
    fontSize: 12,
  },
});
