import { View, Text, StyleSheet } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Lixeiras</Text>

      <View style={styles.mapBox}>
        <Text style={styles.mapText}>🗺️ Mapa será integrado aqui</Text>
        <Text style={styles.mapSub}>
          Futuramente usando react-native-maps
        </Text>
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
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },

  mapBox: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  mapText: {
    color: "white",
    fontSize: 18,
  },

  mapSub: {
    color: "#94a3b8",
    marginTop: 8,
  },
});