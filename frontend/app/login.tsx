import { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthContext } from "@/src/store/AuthContext";

function getErrorMessage(error: any) {
  const status = error?.response?.status;

  if (status === 401) {
    return "E-mail ou senha inválidos.";
  }

  if (status === 422) {
    return "Dados inválidos. Verifique os campos e tente novamente.";
  }

  if (error?.code === "ECONNABORTED") {
    return "Tempo de resposta excedido. Verifique a conexão com a API.";
  }

  return "Não foi possível entrar. Verifique a API e tente novamente.";
}

export default function LoginScreen() {
  const { signIn, isSigningIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Preencha e-mail e senha.");
      return;
    }

    try {
      setErrorMessage("");
      await signIn(email, password);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.badge}>EcoTrack-IA Mobile</Text>
          <Text style={styles.title}>Monitoramento inteligente de coleta</Text>
          <Text style={styles.subtitle}>
            Acesse sua operação e acompanhe lixeiras, rotas e coletas em tempo real.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@ecotrack.com"
            placeholderTextColor="#7A8A86"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            editable={!isSigningIn}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor="#7A8A86"
            secureTextEntry
            style={styles.input}
            editable={!isSigningIn}
          />

          {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && !isSigningIn ? styles.buttonPressed : null,
              isSigningIn ? styles.buttonDisabled : null,
            ]}
            onPress={handleLogin}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>
            Dica: defina `EXPO_PUBLIC_API_URL` para alternar facilmente entre ambientes.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF5F0",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 28,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#D9F2E3",
    color: "#1B8A5A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: "#12372A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4C635C",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#0E1A16",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D312B",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D7E4DD",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#10201B",
    backgroundColor: "#FAFCFB",
    marginBottom: 16,
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1B8A5A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: "#7FB79B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  errorText: {
    color: "#C62828",
    fontSize: 13,
    marginBottom: 8,
  },
  helperText: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: "#70817B",
  },
});
