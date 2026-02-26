import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Perfil() {
  function logout() {
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agente de Coleta</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});