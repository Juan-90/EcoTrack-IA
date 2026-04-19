import { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AxiosError } from "axios";
import { AuthContext } from "@/src/store/AuthContext";
import { useAppTheme } from "@/src/theme/ThemeContext";

type ApiErrorData = {
  detail?: string;
  message?: string;
};

function normalizeTenant(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const onlyDigits = trimmed.replace(/\D/g, "");

  if (onlyDigits.length === 14) {
    return onlyDigits;
  }

  return trimmed.toUpperCase();
}

function formatTenantDisplay(value: string) {
  const trimmed = value.trim();
  const onlyDigits = trimmed.replace(/\D/g, "");

  if (onlyDigits.length === 14) {
    return onlyDigits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  return trimmed;
}

function getTenantHint(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Use o código do tenant ou o CNPJ da prefeitura/empresa.";
  }

  const onlyDigits = trimmed.replace(/\D/g, "");

  if (onlyDigits.length === 14) {
    return `CNPJ identificado: ${formatTenantDisplay(trimmed)}`;
  }

  return "Tenant por código identificado. Exemplo: 001";
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorData>;
  const status = axiosError.response?.status;
  const detail =
    axiosError.response?.data?.detail || axiosError.response?.data?.message;

  if (status === 401) {
    return typeof detail === "string"
      ? detail
      : "Credenciais inválidas para este tenant.";
  }

  if (status === 404) {
    return typeof detail === "string" ? detail : "Tenant não encontrado.";
  }

  if (status === 422) {
    return "Dados inválidos. Verifique tenant, e-mail e senha.";
  }

  if (axiosError.message === "Network Error") {
    return "Não foi possível acessar a API do backend. Verifique IP, porta e se o backend está ativo.";
  }

  if (axiosError.code === "ECONNABORTED") {
    return "Tempo de resposta excedido. Verifique a conexão com a API.";
  }

  return detail || axiosError.message || "Não foi possível entrar. Tente novamente.";

}

export default function LoginScreen() {
  const { signIn, isSigningIn, validateTenant } = useContext(AuthContext);
  const { theme } = useAppTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const [tenant, setTenant] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantType, setTenantType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidatingTenant, setIsValidatingTenant] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleTenantValidation() {
    const normalizedTenant = normalizeTenant(tenant);

    if (!normalizedTenant) {
      setTenantName("");
      setTenantType("");
      setErrorMessage("Informe o tenant controller por código ou CNPJ.");
      return false;
    }

    try {
      setIsValidatingTenant(true);
      setErrorMessage("");

      const result = await validateTenant(normalizedTenant);

      if (!result.exists) {
        setTenantName("");
        setTenantType("");
        setErrorMessage(
          result.message ||
            "Tenant não encontrado. Teste com 001 ou 46.395.000/0001-39."
        );
        return false;
      }

      if (result.status !== "active") {
        setTenantName("");
        setTenantType("");
        setErrorMessage(result.message || "Tenant inativo.");
        return false;
      }

      setTenantName(result.tenant_name || "Tenant validado");
      setTenantType(result.tenant_type || "");
      return true;
    } catch (error) {
      setTenantName("");
      setTenantType("");
      setErrorMessage(getErrorMessage(error));
      return false;
    } finally {
      setIsValidatingTenant(false);
    }
  }

  async function handleLogin() {
    if (!tenant.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Preencha tenant, e-mail e senha.");
      return;
    }

    const tenantOk = await handleTenantValidation();

    if (!tenantOk) {
      return;
    }

    try {
      setErrorMessage("");

      await signIn({
        tenant: normalizeTenant(tenant),
        email,
        password,
      });
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 12),
              paddingBottom: Math.max(insets.bottom + 20, 28),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
                Acesso por tenant
              </Text>

              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Entre com o código ou CNPJ da prefeitura/empresa, depois informe seu
                e-mail e senha.
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
              <Text style={[styles.label, { color: colors.text }]}>
                Tenant Controller
              </Text>
              <TextInput
                value={tenant}
                onChangeText={(value) => {
                  setTenant(value);
                  setTenantName("");
                  setTenantType("");
                  setErrorMessage("");
                }}
                placeholder="001 ou 46.395.000/0001-39"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
                editable={!isSigningIn && !isValidatingTenant}
              />

              <Text style={[styles.tenantHint, { color: colors.textMuted }]}>
                {getTenantHint(tenant)}
              </Text>

              <View
                style={[
                  styles.exampleBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.exampleTitle, { color: colors.text }]}>
                  Tenants de teste
                </Text>
                <Text style={[styles.exampleText, { color: colors.textMuted }]}>
                  ID 001 → EcoTrack Demo
                </Text>
                <Text style={[styles.exampleText, { color: colors.textMuted }]}>
                  CNPJ 46.395.000/0001-39 → Prefeitura de São Paulo
                </Text>
              </View>

              <Pressable
                style={[
                  styles.tenantButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleTenantValidation}
                disabled={isSigningIn || isValidatingTenant}
              >
                {isValidatingTenant ? (
                  <ActivityIndicator color={colors.accent} />
                ) : (
                  <Text style={[styles.tenantButtonText, { color: colors.text }]}>
                    Validar tenant
                  </Text>
                )}
              </Pressable>

              {!!tenantName && (
                <View
                  style={[
                    styles.tenantCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.tenantCardLabel, { color: colors.textMuted }]}
                  >
                    Tenant validado
                  </Text>
                  <Text style={[styles.tenantCardName, { color: colors.text }]}>
                    {tenantName}
                  </Text>
                  {!!tenantType && (
                    <Text
                      style={[styles.tenantCardType, { color: colors.textMuted }]}
                    >
                      Tipo: {tenantType}
                    </Text>
                  )}
                </View>
              )}

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
                  {
                    backgroundColor: isSigningIn
                      ? colors.textMuted
                      : colors.accent,
                  },
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
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
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 10,
  },
  tenantHint: {
    fontSize: 12,
    marginBottom: 14,
  },
  exampleBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  tenantButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  tenantButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  tenantCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  tenantCardLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  tenantCardName: {
    fontSize: 15,
    fontWeight: "800",
  },
  tenantCardType: {
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    minHeight: 52,
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
});
