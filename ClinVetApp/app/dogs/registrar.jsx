import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/customHeader";
import { StatusBar } from "expo-status-bar";

export default function NovoPaciente() {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");

  const router = useRouter();

  async function handleSalvar() {
    if (!nome || !raca || !idade) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    try {
      await api.post(endpoints.cachorros, {
        nome,
        raca,
        idade,
      });

      Alert.alert("Sucesso", "Paciente cadastrado com sucesso!");
      router.back();
    } catch (e) {
      console.error("Erro no cadastro:", e);
      Alert.alert("Erro", "Não foi possível cadastrar o paciente.");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />
      <CustomHeader title="Cadastrar Paciente" userName="Carlos" />

      <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
        <View
          style={{
            backgroundColor: "#E6E6E6",
            borderRadius: 6,
            padding: 16,
            gap: 12,
          }}
        >
          <View>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Nome:</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Thor"
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                padding: 10,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Raça:</Text>
            <TextInput
              value={raca}
              onChangeText={setRaca}
              placeholder="Ex: Pitbull"
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                padding: 10,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Idade:</Text>
            <TextInput
              value={idade}
              onChangeText={setIdade}
              placeholder="Ex: 3"
              keyboardType="numeric"
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                padding: 10,
              }}
            />
          </View>

          {/* Botão salvar */}
          <TouchableOpacity
            onPress={handleSalvar}
            style={{
              backgroundColor: "#704C3A",
              borderRadius: 8,
              paddingVertical: 12,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
