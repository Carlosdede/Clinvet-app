import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/customHeader";
import { StatusBar } from "expo-status-bar";

export default function DogsList() {
  const [dogs, setDogs] = useState([]);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function carregarDogs(p = pagina, b = busca) {
    setLoading(true);
    try {
      const { data } = await api.get(
        `${endpoints.cachorros}?page=${p}&search=${b}`
      );
      setDogs(data.pacientes);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarDogs();
    }, [pagina, busca])
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />

      <CustomHeader title="Pacientes" userName="Carlos" />
      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <TextInput
          placeholder="Buscar paciente"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={() => {
            setPagina(1);
            carregarDogs(1, busca);
          }}
          style={{
            backgroundColor: "#E6E6E6",
            borderRadius: 6,
            padding: 10,
            marginBottom: 12,
          }}
        />

        {/* Lista */}
        {loading ? (
          <ActivityIndicator size="large" color="#704C3A" />
        ) : (
          <FlatList
            data={dogs}
            keyExtractor={(item) => String(item.id_cachorro)}
            ListEmptyComponent={<Text>Nenhum paciente encontrado.</Text>}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#E6E6E6",
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  marginBottom: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: "600" }}>{item.nome}</Text>
                <Text style={{ fontSize: 12, marginBottom: 6 }}>
                  Raça: {item.raca} | Idade: {item.idade} anos
                </Text>

                {/* Botão editar dentro do renderItem */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/dogs/editar",
                      params: {
                        id_cachorro: item.id_cachorro,
                        nome: item.nome,
                        raca: item.raca,
                        idade: item.idade,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#704C3A",
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 6,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    Editar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Paginação */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            paddingVertical: 16,
          }}
        >
          <TouchableOpacity
            disabled={pagina <= 1}
            onPress={() => {
              const nova = pagina - 1;
              setPagina(nova);
              carregarDogs(nova, busca);
            }}
          >
            <Text style={{ opacity: pagina <= 1 ? 0.3 : 1 }}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={{ fontWeight: "bold" }}>{pagina}</Text>

          <TouchableOpacity
            disabled={pagina >= totalPaginas}
            onPress={() => {
              const nova = pagina + 1;
              setPagina(nova);
              carregarDogs(nova, busca);
            }}
          >
            <Text style={{ opacity: pagina >= totalPaginas ? 0.3 : 1 }}>
              {">"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão flutuante */}
        <TouchableOpacity
          onPress={() => router.push("/dogs/registrar")}
          style={{
            backgroundColor: "#704C3A",
            width: 54,
            height: 54,
            borderRadius: 27,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 24,
            right: 24,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 30, lineHeight: 32 }}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
