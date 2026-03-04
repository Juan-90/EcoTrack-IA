import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from "react-native";

export default function Settings() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.text}>Ativar alertas</Text>
          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.text}>Modo escuro</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});