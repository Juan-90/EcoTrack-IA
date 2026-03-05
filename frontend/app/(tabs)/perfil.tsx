import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>Operador de Coleta</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>operador@ecotrack.com</Text>

        <Text style={styles.label}>Coletas realizadas</Text>
        <Text style={styles.value}>128</Text>
      </View>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },

  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
  },

  label: {
    color: "#94a3b8",
    marginTop: 10,
  },

  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  logout: {
    marginTop: 30,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});