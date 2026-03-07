import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Historico() {
  const historico = [
    { id: '1', data: '10/02', nivel: 45 },
    { id: '2', data: '11/02', nivel: 70 },
    { id: '3', data: '12/02', nivel: 90 },
    { id: '4', data: '13/02', nivel: 60 },
    { id: '5', data: '14/02', nivel: 80 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Ocupação</Text>

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.data}</Text>
            <Text style={styles.level}>Nível: {item.nivel}%</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  level: {
    marginTop: 5,
    fontSize: 14,
  },
});