import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getBins } from "@/src/services/binService";
import { Bin } from "@/src/types/bin";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getBins();
    setBins(data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await loadData();
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadData]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }

  const criticalBins = bins.filter((bin) => bin.status === "critical").length;
  const warningBins = bins.filter((bin) => bin.status === "warning").length;
  const collectedBins = bins.filter((bin) => bin.status === "collected").length;
  const nextPriority = bins.find(
    (bin) => bin.status === "critical" || bin.status === "warning"
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B8A5A" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.title}>Operação de coleta</Text>
        <Text style={styles.subtitle}>
          Acompanhe apenas o que importa para o turno de hoje.
        </Text>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.metricCard, styles.metricCritical]}>
          <Text style={styles.metricLabel}>Críticas</Text>
          <Text style={styles.metricValue}>{criticalBins}</Text>
          <Text style={styles.metricDescription}>Coleta imediata</Text>
        </View>

        <View style={[styles.metricCard, styles.metricWarning]}>
          <Text style={styles.metricLabel}>Atenção</Text>
          <Text style={styles.metricValue}>{warningBins}</Text>
          <Text style={styles.metricDescription}>Monitorar rota</Text>
        </View>
      </View>

      <View style={styles.metricCardWide}>
        <Text style={styles.metricLabel}>Coletas concluídas</Text>
        <Text style={styles.metricValueWide}>{collectedBins}</Text>
        <Text style={styles.metricDescription}>
          Lixeiras marcadas como coletadas no app
        </Text>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.sectionTitle}>Próxima prioridade</Text>

        {nextPriority ? (
          <>
            <Text style={styles.nextName}>{nextPriority.name}</Text>
            <Text style={styles.nextMeta}>
              {nextPriority.district} • {nextPriority.level}%
            </Text>
            <Text style={styles.nextRoute}>
              {nextPriority.routeName || "Rota do dia"}
            </Text>
          </>
        ) : (
          <Text style={styles.emptyText}>
            Nenhuma lixeira prioritária no momento.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F7F4",
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3F7F4",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B8A5A",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10251D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5B6B65",
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
  },
  metricCritical: {
    backgroundColor: "#FDECEC",
  },
  metricWarning: {
    backgroundColor: "#FFF3E2",
  },
  metricCardWide: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#33423C",
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#10251D",
  },
  metricValueWide: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1B8A5A",
  },
  metricDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#66756F",
  },
  nextCard: {
    backgroundColor: "#0F3D2E",
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9FD9BE",
    marginBottom: 10,
  },
  nextName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  nextMeta: {
    fontSize: 15,
    color: "#E1F2E8",
    marginBottom: 4,
  },
  nextRoute: {
    fontSize: 14,
    color: "#BDE7CF",
  },
  emptyText: {
    fontSize: 14,
    color: "#D7EADF",
  },
});
