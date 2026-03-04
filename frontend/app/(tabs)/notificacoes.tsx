import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const mockNotifications = [
  { id: 1, message: "Lixeira Centro - 92% cheia", level: 92 },
  { id: 2, message: "Lixeira Praça Norte - 87% cheia", level: 87 },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.message}</Text>
          </View>
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
  title: {
    fontSize: 24,
    color: "#22C55E",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});