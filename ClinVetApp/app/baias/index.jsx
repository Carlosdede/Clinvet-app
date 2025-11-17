import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import CustomHeader from "../../components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function ListarBaias() {
  const [baias, setBaias] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      buscarBaias();
    }, [])
  );

  async function buscarBaias() {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await api.get(endpoints.baias, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBaias(data);
    } catch (error) {
      console.error("Erro ao buscar baias:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />

      <CustomHeader title="Baias" userName="Carlos" />
      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <TextInput
            placeholder="Buscar baia"
            placeholderTextColor="#555"
            value={busca}
            onChangeText={setBusca}
            style={{
              backgroundColor: "#E2E2E2",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#7B4F3A" />
          ) : (
            <FlatList
              data={baias.filter((b) =>
                b.nome_baia.toLowerCase().includes(busca.toLowerCase())
              )}
              keyExtractor={(item) => String(item.id_baia)}
              ListEmptyComponent={<Text>Nenhuma baia encontrada.</Text>}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#E2E2E2",
                    padding: 14,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.nome_baia}</Text>
                  <Text>Paciente: {item.nome_cachorro || "Livre"}</Text>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#7B4F3A",
                      marginTop: 10,
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      borderRadius: 6,
                      alignSelf: "flex-start",
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/baias/editar",
                        params: {
                          id_baia: item.id_baia,
                          nome_baia: item.nome_baia,
                          tem_cachorro: item.nome_cachorro ? "true" : "false",
                        },
                      })
                    }
                  >
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                      Editar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {/* Botão de adicionar nova baia */}
          <TouchableOpacity
            onPress={() => router.push("/baias/registrar")}
            style={{
              backgroundColor: "#7B4F3A",
              width: 50,
              height: 50,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: 25,
              right: 25,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 26 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
