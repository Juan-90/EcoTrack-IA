import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { getBins } from "@/src/services/binService";
import { Bin } from "@/src/types/bin";
import { useAppTheme } from "@/src/theme/ThemeContext";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const { theme } = useAppTheme();
  const { colors } = theme;

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
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
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
    >
      <View style={styles.hero}>
        <Text style={[styles.greeting, { color: colors.accent }]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Operação de coleta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Acompanhe apenas o que importa para o turno de hoje.
        </Text>
      </View>

      <View style={styles.cardRow}>
        <View
          style={[
            styles.metricCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
            Críticas
          </Text>
          <Text style={[styles.metricValue, { color: colors.danger }]}>
            {criticalBins}
          </Text>
          <Text style={[styles.metricDescription, { color: colors.textMuted }]}>
            Coleta imediata
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
            Atenção
          </Text>
          <Text style={[styles.metricValue, { color: colors.warning }]}>
            {warningBins}
          </Text>
          <Text style={[styles.metricDescription, { color: colors.textMuted }]}>
            Monitorar rota
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.metricCardWide,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
          Coletas concluídas
        </Text>
        <Text style={[styles.metricValueWide, { color: colors.accent }]}>
          {collectedBins}
        </Text>
        <Text style={[styles.metricDescription, { color: colors.textMuted }]}>
          Lixeiras marcadas como coletadas no app
        </Text>
      </View>

      <View
        style={[
          styles.nextCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Próxima prioridade
        </Text>

        {nextPriority ? (
          <>
            <Text style={[styles.nextName, { color: colors.text }]}>
              {nextPriority.name}
            </Text>
            <Text style={[styles.nextMeta, { color: colors.textMuted }]}>
              {nextPriority.district} • {nextPriority.level}%
            </Text>
            <Text style={[styles.nextRoute, { color: colors.info }]}>
              {nextPriority.routeName || "Rota do dia"}
            </Text>

            <Pressable
              style={[
                styles.ctaButton,
                { backgroundColor: colors.accent },
              ]}
              onPress={() => router.push(`/lixeira/${nextPriority.id}`)}
            >
              <Text style={styles.ctaButtonText}>Abrir próxima coleta</Text>
            </Pressable>
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Nenhuma lixeira prioritária no momento.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { marginBottom: 20 },
  greeting: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
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
    borderWidth: 1,
  },
  metricCardWide: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 30,
    fontWeight: "800",
  },
  metricValueWide: {
    fontSize: 34,
    fontWeight: "800",
  },
  metricDescription: {
    marginTop: 6,
    fontSize: 13,
  },
  nextCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  nextName: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  nextMeta: {
    fontSize: 15,
    marginBottom: 4,
  },
  nextRoute: {
    fontSize: 14,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
  },
  ctaButton: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
