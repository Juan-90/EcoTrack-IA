import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";

export default function Settings() {
  const [alerts, setAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.option}>
        <Text style={styles.text}>Alertas de coleta</Text>
        <Switch value={alerts} onValueChange={setAlerts} />
      </View>

      <View style={styles.option}>
        <Text style={styles.text}>Modo escuro</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
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

  option: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  text: {
    color: "#fff",
  },
});