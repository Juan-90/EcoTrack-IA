import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function BinDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bin, setBin] = useState<Bin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const updated = await markBinAsCollected(id);
      setBin(updated);

      Alert.alert("Coleta registrada", "A lixeira foi marcada como coletada.");
    } catch (error) {
      Alert.alert(
        "Erro ao registrar coleta",
        "Não foi possível concluir a ação agora."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B8A5A" />
      </View>
    );
  }

  if (!bin) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFoundTitle}>Lixeira não encontrada</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>{bin.name}</Text>
        <Text style={styles.subtitle}>{bin.district}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(bin.status) },
          ]}
        >
          <Text style={styles.statusBadgeText}>{getStatusLabel(bin.status)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informações da coleta</Text>
        <Text style={styles.infoLine}>Nível atual: {bin.level}%</Text>
        <Text style={styles.infoLine}>
          Rota: {bin.routeName || "Rota do dia"}
        </Text>
        <Text style={styles.infoLine}>
          Endereço: {bin.address || "Não informado"}
        </Text>
        <Text style={styles.infoLine}>
          Última atualização:{" "}
          {new Date(bin.updatedAt).toLocaleString("pt-BR")}
        </Text>
        <Text style={styles.infoLine}>
          Última coleta:{" "}
          {bin.lastCollection
            ? new Date(bin.lastCollection).toLocaleString("pt-BR")
            : "Sem registro"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Orientação operacional</Text>
        <Text style={styles.helperText}>
          Priorize esta lixeira se ela estiver no caminho da rota atual ou com
          risco de transbordo.
        </Text>
      </View>

      <Pressable
        style={[
          styles.collectButton,
          bin.status === "collected" ? styles.collectButtonDone : null,
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
    padding: 24,
  },
  hero: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10251D",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#60716A",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#193029",
    marginBottom: 12,
  },
  infoLine: {
    fontSize: 14,
    lineHeight: 21,
    color: "#455751",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#566862",
  },
  collectButton: {
    backgroundColor: "#1B8A5A",
    borderRadius: 16,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  collectButtonDone: {
    backgroundColor: "#6E8E80",
  },
  collectButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2A24",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#1B8A5A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
