import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function BinDetails() {
  const { id } = useLocalSearchParams();

  const level = Math.floor(Math.random() * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lixeira #{id}</Text>

      <Text style={styles.label}>Nível de ocupação</Text>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${level}%` }]} />
      </View>

      <Text style={styles.percent}>{level}% cheio</Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>📍 Localização: Praça Central</Text>
        <Text style={styles.info}>📡 Sensor: Ultrassônico</Text>
        <Text style={styles.info}>🕒 Última leitura: agora</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },

  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },

  label: {
    color: "#94a3b8",
  },

  bar: {
    height: 16,
    backgroundColor: "#334155",
    borderRadius: 10,
    marginTop: 10,
  },

  fill: {
    height: 16,
    backgroundColor: "#22c55e",
    borderRadius: 10,
  },

  percent: {
    color: "white",
    marginTop: 10,
  },

  infoBox: {
    marginTop: 30,
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
  },

  info: {
    color: "#e2e8f0",
    marginBottom: 6,
  },
});