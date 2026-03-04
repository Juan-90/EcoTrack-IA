import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { api } from "../../src/api/api";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBins() {
      try {
        setLoading(true);
        const response = await api.get("/bins"); // endpoint do backend
        setBins(response.data);
      } catch (error) {
        console.error("Erro ao buscar lixeiras:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBins();
  }, []);

  const averageLevel =
    bins.length > 0
      ? Math.round(
          bins.reduce((sum, b) => sum + Number(b.level), 0) / bins.length
        )
      : 0;

  const onPressBin = (id: number) => {
  router.push(`/lixeira/${id}`);
};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total de lixeiras: {bins.length}
        </Text>
        <Text style={styles.summaryText}>
          Média preenchimento: {averageLevel}%
        </Text>
      </View>

      <FlatList
        data={bins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.binCard,
              item.level > 85 && styles.cardAlert,
            ]}
            onPress={() => onPressBin(item.id)}
          >
            <Text style={styles.binName}>{item.name}</Text>
            <Text style={styles.binLevel}>{item.level}%</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#22C55E",
    marginBottom: 12,
    textAlign: "center",
  },
  summary: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#1E293B",
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    color: "#fff",
  },
  binCard: {
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardAlert: {
    backgroundColor: "#EF4444",
  },
  binName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  binLevel: {
    fontSize: 16,
    color: "#fff",
    marginTop: 6,
  },
});