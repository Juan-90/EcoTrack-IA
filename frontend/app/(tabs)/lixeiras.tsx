import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const lixeirasMock = [
  { id: "1", nome: "Centro - Praça", bairro: "Centro", nivel: 90 },
  { id: "2", nome: "Bairro Florestal", bairro: "Florestal", nivel: 65 },
  { id: "3", nome: "Universidade", bairro: "Universitário", nivel: 30 },
  { id: "4", nome: "Rodoviária", bairro: "Centro", nivel: 85 },
];

function getPriority(nivel: number) {
  if (nivel >= 80) return { label: "Alta", color: "#E53935" };
  if (nivel >= 50) return { label: "Média", color: "#FB8C00" };
  return { label: "Baixa", color: "#43A047" };
}

export default function Lixeiras() {
  const sorted = [...lixeirasMock].sort((a, b) => b.nivel - a.nivel);

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const priority = getPriority(item.nivel);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/lixeira/${item.id}`)}
            >
              <Text style={styles.nome}>{item.nome}</Text>
              <Text>Bairro: {item.bairro}</Text>
              <Text>Nível: {item.nivel}%</Text>

              <View style={[styles.badge, { backgroundColor: priority.color }]}>
                <Text style={styles.badgeText}>
                  Prioridade {priority.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  badge: {
    marginTop: 10,
    padding: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});