import { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext, AuthProvider } from "@/src/store/AuthContext";

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inTabsGroup = segments[0] === "(tabs)";
    const inLoginScreen = segments[0] === "login";

    if (!isAuthenticated && inTabsGroup) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && !inTabsGroup) {
      router.replace("/(tabs)/dashboard");
      return;
    }

    if (!isAuthenticated && !inLoginScreen) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B8A5A" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="lixeira/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F7F5",
  },
});
