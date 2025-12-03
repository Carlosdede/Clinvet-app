import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import api from "../src/api/api";
import { endpoints } from "../src/api/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerForPushNotificationsAsync } from "../src/services/notifications";

export default function LoginScreen() {
  const [username, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    console.log("Iniciando login. BASE_URL =>", api.defaults.baseURL);

    let expoToken = null;

    // tenta pegar token, mas não deixa o login morrer
    try {
      expoToken = await registerForPushNotificationsAsync();
      console.log("EXPO TOKEN GERADO:", expoToken);
    } catch (err) {
      console.log(
        "Erro inesperado ao tentar registrar push. Prosseguindo sem token.",
        err?.message || err
      );
      expoToken = null;
    }

    try {
      const { data } = await api.post(endpoints.login, {
        username,
        senha,
        expo_token: expoToken,
      });

      console.log("Resposta login:", data);

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        router.push("/home");
      } else {
        Alert.alert("Erro", "Credenciais inválidas.");
      }
    } catch (e) {
      console.error(
        "Erro no login detalhado:",
        JSON.stringify(
          {
            message: e.message,
            code: e.code,
            isAxiosError: !!e.isAxiosError,
            status: e.response?.status,
            data: e.response?.data,
          },
          null,
          2
        )
      );

      if (e.response) {
        const msg = e.response.data?.error || "Erro de autenticação.";
        return Alert.alert("Erro", msg);
      }

      Alert.alert(
        "Erro",
        "Falha ao comunicar com o servidor. Verifique sua conexão."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>ClinVet Security</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#B5A99D"
          autoCapitalize="none"
          keyboardType="email-address"
          value={username}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#B5A99D"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
        />

        <Text style={styles.forgotText}>Esqueceu a senha?</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6B4C3A",
    marginBottom: 30,
  },
  input: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#C6B5A0",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#4A3B31",
    backgroundColor: "#FFF",
    marginBottom: 14,
  },
  forgotText: {
    width: "85%",
    fontSize: 12,
    color: "#7C6B5F",
    textAlign: "left",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6B4C3A",
    borderRadius: 25,
    width: "85%",
    paddingVertical: 14,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
