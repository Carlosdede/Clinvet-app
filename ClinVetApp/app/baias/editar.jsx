import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import CustomHeader from "../../components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditarBaia() {
  const { id_baia, nome_baia, tem_cachorro } = useLocalSearchParams();
  const [nome, setNome] = useState(nome_baia || "");
  const [cachorros, setCachorros] = useState([]);
  const [cachorroSelecionado, setCachorroSelecionado] = useState("");
  const router = useRouter();

  const temCachorroAssociado = tem_cachorro === "true";

  useEffect(() => {
    carregarCachorros();
  }, []);

  async function carregarCachorros() {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await api.get(endpoints.cachorros, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCachorros(data.pacientes || []);
    } catch (error) {
      console.error("❌ Erro ao carregar cachorros:", error);
    }
  }

  async function atualizar() {
    if (!nome.trim()) return Alert.alert("Erro", "Informe o nome da baia.");

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("➡️ PUT", `${endpoints.baias}/${id_baia}`, {
        nome_baia: nome,
        id_cachorro: cachorroSelecionado || null,
      });

      await api.put(
        `${endpoints.baias}/${id_baia}`,
        { nome_baia: nome, id_cachorro: cachorroSelecionado || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Sucesso", "Baia atualizada com sucesso!");
      router.back();
    } catch (error) {
      console.error(
        "❌ Erro ao atualizar baia:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Falha ao atualizar baia. Veja o console.");
    }
  }

  async function removerCachorro() {
    Alert.alert("Remover cachorro", "Deseja realmente remover o cachorro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            console.log("➡️ DELETE", `${endpoints.baiaCachorro}/${id_baia}`);

            await api.delete(`${endpoints.baiaCachorro}/${id_baia}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setCachorroSelecionado("");
            Alert.alert("Sucesso", "Cachorro removido da baia!");
          } catch (error) {
            console.error(
              "❌ Erro ao remover cachorro:",
              error.response?.data || error.message
            );
            Alert.alert("Erro", "Falha ao remover cachorro. Veja o console.");
          }
        },
      },
    ]);
  }

  async function excluirBaia() {
    Alert.alert("Excluir baia", "Deseja realmente excluir esta baia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            console.log("➡️ DELETE", `${endpoints.baias}/${id_baia}`);

            await api.delete(`${endpoints.baias}/${id_baia}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Sucesso", "Baia excluída com sucesso!");
            router.back();
          } catch (error) {
            console.error(
              "❌ Erro ao excluir baia:",
              error.response?.data || error.message
            );
            Alert.alert("Erro", "Falha ao excluir baia. Veja o console.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <CustomHeader title="Editar Baia" userName="Carlos" />
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
          <Text style={{ marginBottom: 8 }}>Nome da Baia:</Text>
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

          <Text style={{ marginBottom: 8 }}>Paciente associado:</Text>
          <Picker
            selectedValue={cachorroSelecionado}
            onValueChange={(val) => setCachorroSelecionado(val)}
            style={{
              backgroundColor: "#FFF",
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <Picker.Item label="Selecione um paciente" value="" />
            {cachorros.map((c) => (
              <Picker.Item
                key={c.id_cachorro}
                label={c.nome}
                value={c.id_cachorro}
              />
            ))}
          </Picker>

          <TouchableOpacity
            onPress={atualizar}
            style={{
              backgroundColor: "#7B4F3A",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text
              style={{ color: "#FFF", textAlign: "center", fontWeight: "bold" }}
            >
              Salvar Alterações
            </Text>
          </TouchableOpacity>

          {temCachorroAssociado && (
            <TouchableOpacity
              onPress={removerCachorro}
              style={{
                backgroundColor: "#DBA67A",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Remover Paciente da Baia
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={excluirBaia}
            style={{
              backgroundColor: "#D9534F",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#FFF", textAlign: "center", fontWeight: "bold" }}
            >
              Excluir Baia
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
