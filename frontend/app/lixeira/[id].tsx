import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "../../src/api/api";

const { width } = Dimensions.get("window");

export default function BinDetails() {
  const { id } = useLocalSearchParams();
  const [bin, setBin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBin() {
      try {
        const response = await api.get(`/lixeira/${id}`);
        setBin(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBin();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (!bin) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>Lixeira não encontrada.</Text>
      </View>
    );
  }

  const levelWidth = (bin.level / 100) * (width - 40);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bin.name}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Localização:</Text>
        <Text style={styles.value}>{bin.location}</Text>

        <Text style={styles.label}>Nível atual:</Text>
        <Text style={styles.value}>{bin.level}%</Text>

        <View style={styles.graphContainer}>
          <View style={[styles.graphFill, { width: levelWidth }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#22C55E",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 12,
  },
  label: {
    color: "#94A3B8",
    marginTop: 10,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
  graphContainer: {
    height: 20,
    backgroundColor: "#334155",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  graphFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },
});