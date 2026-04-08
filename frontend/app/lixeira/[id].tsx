import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  getBinById,
  markBinAsCollected,
} from "@/src/services/binService";
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

export default function BinDetailsScreen() {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const { id } = useLocalSearchParams<{ id: string }>();
  const [bin, setBin] = useState<Bin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadBin = useCallback(async () => {
    if (!id) return;
    const data = await getBinById(id);
    setBin(data);
  }, [id]);

  useEffect(() => {
    async function init() {
      try {
        await loadBin();
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadBin]);

  async function handleCollect() {
    if (!id || !bin || bin.status === "collected") {
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);

      const updated = await markBinAsCollected(id);
      setBin(updated);
      setFeedback({
        type: "success",
        message: "Coleta registrada com sucesso.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível registrar a coleta agora.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!bin) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.notFoundTitle, { color: colors.text }]}>
          Lixeira não encontrada
        </Text>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.accent }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = getStatusColor(bin.status, colors);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.text }]}>{bin.name}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {bin.district}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>{getStatusLabel(bin.status)}</Text>
        </View>
      </View>

      {feedback ? (
        <View
          style={[
            styles.feedbackCard,
            {
              backgroundColor: colors.card,
              borderColor:
                feedback.type === "success" ? colors.accent : colors.danger,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                color:
                  feedback.type === "success" ? colors.accent : colors.danger,
              },
            ]}
          >
            {feedback.message}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Informações da coleta
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Nível atual: {bin.level}%
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Rota: {bin.routeName || "Rota do dia"}
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Endereço: {bin.address || "Não informado"}
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Última atualização: {new Date(bin.updatedAt).toLocaleString("pt-BR")}
        </Text>
        <Text style={[styles.infoLine, { color: colors.textMuted }]}>
          Última coleta:{" "}
          {bin.lastCollection
            ? new Date(bin.lastCollection).toLocaleString("pt-BR")
            : "Sem registro"}
        </Text>
      </View>

      <Pressable
        style={[
          styles.collectButton,
          {
            backgroundColor:
              bin.status === "collected" ? colors.textMuted : colors.accent,
          },
        ]}
        onPress={handleCollect}
        disabled={isSubmitting || bin.status === "collected"}
      >
        <Text style={styles.collectButtonText}>
          {bin.status === "collected"
            ? "Coleta já registrada"
            : isSubmitting
            ? "Registrando coleta..."
            : "Marcar como coletada"}
        </Text>
      </Pressable>
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
    padding: 24,
  },
  hero: { marginBottom: 18 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  feedbackCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoLine: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  collectButton: {
    borderRadius: 16,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  collectButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  backButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
