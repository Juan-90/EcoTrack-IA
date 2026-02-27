import { View, Text, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

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

export default function DetalheLixeira() {
  const { id } = useLocalSearchParams();

  const lixeira = lixeirasMock.find((item) => item.id === id);

  if (!lixeira) {
    return (
      <View style={styles.container}>
        <Text>Lixeira não encontrada</Text>
      </View>
    );
  }

  const priority = getPriority(lixeira.nivel);

  function marcarColetada() {
    alert("Lixeira marcada como coletada!");
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{lixeira.nome}</Text>
      <Text style={styles.info}>Bairro: {lixeira.bairro}</Text>
      <Text style={styles.info}>Nível atual: {lixeira.nivel}%</Text>

      <View style={[styles.badge, { backgroundColor: priority.color }]}>
        <Text style={styles.badgeText}>
          Prioridade {priority.label}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Marcar como coletada" onPress={marcarColetada} />
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
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  badge: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});