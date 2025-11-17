import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import CustomHeader from "../../components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function AssociarCachorro() {
  const { id_baia, nome_baia } = useLocalSearchParams();
  const [cachorros, setCachorros] = useState([]);
  const [selecionado, setSelecionado] = useState("");
  const router = useRouter();

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
      console.error("Erro ao buscar cachorros:", error);
      setCachorros([]);
    }
  }
  async function associar() {
    if (!selecionado) return Alert.alert("Erro", "Selecione um paciente.");
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        endpoints.baiaCachorro,
        { id_baia, id_cachorro: selecionado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Sucesso", "Cachorro associado à baia!");
      router.back();
    } catch (error) {
      console.error("Erro ao associar:", error);
      Alert.alert("Erro", "Falha ao associar cachorro.");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />

      <CustomHeader title="Adicionar Paciente" userName="Carlos" />
      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
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
            <Text style={{ marginBottom: 8 }}>Paciente:</Text>

            <Picker
              selectedValue={selecionado}
              onValueChange={(val) => setSelecionado(val)}
              style={{
                backgroundColor: "#FFF",
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Picker.Item label="Selecione o paciente" value="" />
              {Array.isArray(cachorros) &&
                cachorros.map((c) => (
                  <Picker.Item
                    key={c.id_cachorro}
                    label={c.nome}
                    value={c.id_cachorro}
                  />
                ))}
            </Picker>

            <TouchableOpacity
              onPress={associar}
              style={{
                backgroundColor: "#D9534F",
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
                Associar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
