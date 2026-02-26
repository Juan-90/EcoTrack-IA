import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Dia</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔴 Críticas</Text>
        <Text style={styles.cardValue}>3</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🟡 Atenção</Text>
        <Text style={styles.cardValue}>5</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🟢 Normais</Text>
        <Text style={styles.cardValue}>8</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
});