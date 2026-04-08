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

function getStatusLabel(status: Bin["status"]) {
  if (status === "critical") return "Prioridade alta";
  if (status === "warning") return "Atenção";
  if (status === "collected") return "Coletada";
  return "Normal";
}

function getStatusColor(status: Bin["status"]) {
  if (status === "critical") return "#D32F2F";
  if (status === "warning") return "#F57C00";
  if (status === "collected") return "#1B8A5A";
  return "#2E7D32";
}

export default function LixeirasScreen() {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B8A5A" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Coletas do dia</Text>
            <Text style={styles.subtitle}>
              Priorize lixeiras com maior nível de ocupação.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/lixeira/${item.id}`)}
          >
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.district} • {item.routeName || "Rota do dia"}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.level}%`,
                      backgroundColor: getStatusColor(item.status),
                    },
                  ]}
                />
              </View>
              <Text style={styles.level}>{item.level}%</Text>
            </View>

            <Text style={styles.updatedText}>
              Atualizada em {new Date(item.updatedAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhuma lixeira disponível</Text>
            <Text style={styles.emptySubtitle}>
              Tente atualizar a lista novamente.
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
    backgroundColor: "#F3F7F4",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3F7F4",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10251D",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5B6B65",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
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
    color: "#15241F",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#687771",
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
    backgroundColor: "#E6EEEA",
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
    color: "#22332D",
  },
  updatedText: {
    fontSize: 12,
    color: "#7A8782",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22332D",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#74827C",
  },
});
