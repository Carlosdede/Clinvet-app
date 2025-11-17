import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import CustomHeader from "../../components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function CadastrarBaia() {
  const [nome, setNome] = useState("");
  const router = useRouter();

  async function salvar() {
    if (!nome.trim()) return Alert.alert("Erro", "Informe o nome da baia.");
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        endpoints.baias,
        { nome_baia: nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Sucesso", "Baia cadastrada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao cadastrar baia:", error);
      Alert.alert("Erro", "Falha ao cadastrar baia.");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />
      <CustomHeader title="Cadastrar baia" userName="Carlos" />
      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <View
          style={{
            flex: 1,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#E2E2E2",
              width: "85%",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text style={{ marginBottom: 8 }}>Nome:</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome da baia"
              style={{
                backgroundColor: "#FFF",
                borderRadius: 8,
                padding: 10,
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              onPress={salvar}
              style={{
                backgroundColor: "#7B4F3A",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
