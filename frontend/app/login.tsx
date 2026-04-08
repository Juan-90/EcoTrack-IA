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
import { AxiosError } from "axios";
import { AuthContext } from "@/src/store/AuthContext";
import { useAppTheme } from "@/src/theme/ThemeContext";

type ApiErrorData = {
  detail?: string;
};

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorData>;
  const status = axiosError.response?.status;
  const detail = axiosError.response?.data?.detail;

  if (status === 401) {
    return typeof detail === "string"
      ? detail
      : "E-mail ou senha inválidos.";
  }

  if (status === 422) {
    return "Dados inválidos. Verifique os campos e tente novamente.";
  }

  if (axiosError.message === "Network Error") {
    return "Não foi possível conectar à API. Verifique IP, porta, backend ativo e se o celular está na mesma rede.";
  }

  if (axiosError.code === "ECONNABORTED") {
    return "Tempo de resposta excedido. Verifique a conexão com a API.";
  }

  return detail || "Não foi possível entrar. Verifique a API e tente novamente.";
}

export default function LoginScreen() {
  const { signIn, isSigningIn } = useContext(AuthContext);
  const { theme } = useAppTheme();
  const { colors } = theme;

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
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorData>;

      console.log("LOGIN_ERROR", {
        message: axiosError.message,
        code: axiosError.code,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[
              styles.badge,
              {
                backgroundColor: colors.surface,
                color: colors.accent,
                borderColor: colors.border,
              },
            ]}
          >
            EcoTrack-IA Mobile
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Monitoramento inteligente de coleta
          </Text>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Acesse sua operação e acompanhe lixeiras, rotas e coletas em tempo real.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@ecotrack.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            editable={!isSigningIn}
          />

          <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            editable={!isSigningIn}
          />

          {!!errorMessage && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errorMessage}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: isSigningIn ? colors.textMuted : colors.accent },
              pressed && !isSigningIn ? styles.buttonPressed : null,
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

          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            Ambiente da API controlado por `EXPO_PUBLIC_API_URL`.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  errorText: {
    fontSize: 13,
    marginBottom: 8,
  },
  helperText: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
  },
});
