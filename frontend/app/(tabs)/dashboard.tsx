import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const bins = [
  { id: 1, name: "Praça Central", level: 85 },
  { id: 2, name: "Rua das Flores", level: 40 },
  { id: 3, name: "Parque Municipal", level: 65 },
  { id: 4, name: "Escola Municipal", level: 20 },
];

export default function Dashboard() {
  const router = useRouter();

  const criticalBins = bins.filter((b) => b.level > 80);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>EcoTrack IA</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{bins.length}</Text>
          <Text style={styles.cardLabel}>Lixeiras monitoradas</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>18</Text>
          <Text style={styles.cardLabel}>Coletas hoje</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>{criticalBins.length}</Text>
          <Text style={styles.cardLabel}>Lixeiras críticas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lixeiras com nível alto</Text>

      {criticalBins.map((bin) => (
        <TouchableOpacity
          key={bin.id}
          style={styles.binCard}
          onPress={() => router.push(`/lixeira/${bin.id}`)}
        >
          <Text style={styles.binName}>{bin.name}</Text>

          <View style={styles.levelBar}>
            <View style={[styles.levelFill, { width: `${bin.level}%` }]} />
          </View>

          <Text style={styles.levelText}>{bin.level}% cheio</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },

  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
  },

  cardLabel: {
    color: "#94a3b8",
    textAlign: "center",
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },

  binCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  binName: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },

  levelBar: {
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 6,
  },

  levelFill: {
    height: 8,
    backgroundColor: "#22c55e",
    borderRadius: 6,
  },

  levelText: {
    color: "#94a3b8",
    marginTop: 6,
  },
});