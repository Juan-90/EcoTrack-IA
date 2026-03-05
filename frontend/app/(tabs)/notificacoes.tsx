import { View, Text, StyleSheet, FlatList } from "react-native";

const notifications = [
  {
    id: 1,
    message: "🚨 Lixeira Hospital está 91% cheia",
  },
  {
    id: 2,
    message: "⚠️ Lixeira Centro precisa de coleta",
  },
  {
    id: 3,
    message: "✅ Coleta realizada na Lixeira Parque",
  },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      <FlatList
        data={notifications}
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  text: {
    color: "#fff",
  },
});