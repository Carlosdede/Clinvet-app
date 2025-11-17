import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import CustomHeader from "../../components/customHeader";
import { StatusBar } from "expo-status-bar";

export default function EditarPaciente() {
  const { id_cachorro, nome, raca, idade } = useLocalSearchParams();
  const [novoNome, setNovoNome] = useState(nome);
  const [novaRaca, setNovaRaca] = useState(raca);
  const [novaIdade, setNovaIdade] = useState(String(idade));
  const router = useRouter();

  //  Atualizar paciente
  async function atualizar() {
    if (!novoNome || !novaRaca || !novaIdade) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    try {
      await api.put(`${endpoints.cachorros}/${id_cachorro}`, {
        nome: novoNome,
        raca: novaRaca,
        idade: novaIdade,
      });
      Alert.alert("Sucesso", "Paciente atualizado com sucesso!");
      setTimeout(() => router.back(), 300);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      Alert.alert("Erro", "Falha ao atualizar paciente.");
    }
  }

  // Excluir paciente
  async function excluir() {
    Alert.alert("Excluir Paciente", "Deseja realmente excluir este paciente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`${endpoints.cachorros}/${id_cachorro}`);
            Alert.alert("Sucesso", "Paciente excluído com sucesso!");
            setTimeout(() => router.back(), 300);
          } catch (error) {
            console.error("Erro ao excluir paciente:", error);
            Alert.alert("Erro", "Falha ao excluir paciente.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />
      <CustomHeader title="Editar Paciente" userName="Carlos" />

      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <View
          style={{
            backgroundColor: "#E6E6E6",
            borderRadius: 8,
            padding: 16,
            gap: 12,
          }}
        >
          <View>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Nome:</Text>
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome do paciente"
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
              value={novaRaca}
              onChangeText={setNovaRaca}
              placeholder="Raça do paciente"
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
              value={novaIdade}
              onChangeText={setNovaIdade}
              keyboardType="numeric"
              placeholder="Idade em anos"
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                padding: 10,
              }}
            />
          </View>

          {/* Botão salvar */}
          <TouchableOpacity
            onPress={atualizar}
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
              Salvar Alterações
            </Text>
          </TouchableOpacity>

          {/* Botão excluir */}
          <TouchableOpacity
            onPress={excluir}
            style={{
              backgroundColor: "#D9534F",
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
              Excluir Paciente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
