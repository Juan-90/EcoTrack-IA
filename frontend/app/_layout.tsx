import { Stack } from "expo-router";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../src/store/AuthContext";

function RootNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // depois podemos colocar SplashScreen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}