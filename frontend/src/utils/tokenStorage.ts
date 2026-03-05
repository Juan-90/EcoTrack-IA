import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@ecotrack_token";

// 🔐 Salvar token
export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log("Erro ao salvar token:", error);
  }
}

// 🔎 Buscar token
export async function getToken() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.log("Erro ao buscar token:", error);
    return null;
  }
}

// 🚪 Remover token
export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log("Erro ao remover token:", error);
  }
}