import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useAuth } from "../src/store/AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  function handleLogin() {
    const success = login(email, password);

    if (success) {
      router.replace("/dashboard");
    } else {
      Alert.alert("Erro", "Credenciais inválidas");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoTrack IA</Text>

      <Text style={styles.subtitle}>
        Sistema Inteligente de Gestão de Resíduos
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Login teste:{"\n"}
        admin@ecotrack.com{"\n"}
        123456
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08130D",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 40,
  },

  input: {
    backgroundColor: "#1b4332",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    color: "#fff",
  },

  button: {
    backgroundColor: "#2d6a4f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  hint: {
    marginTop: 30,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
  },
});