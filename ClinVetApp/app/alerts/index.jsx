import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../../src/api/api";
import { endpoints } from "../../src/api/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data } = await api.get(endpoints.alerts, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(data);
      } catch (e) {
        console.error("Erro ao buscar alertas:", e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <CustomHeader title="Alertas" userName="Carlos" />

      <View style={styles.container}>
        <FlatList
          data={alerts}
          keyExtractor={(item, idx) => String(item.id_alerta ?? idx)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Text style={styles.tipo}>
                {item.tipo === "convulsao"
                  ? "Convulsão"
                  : item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
              </Text>

              <Text style={styles.cachorro}>{item.nome_cachorro}</Text>
              <Text>Baia: {item.nome_baia}</Text>
              <Text>Confiança: {item.confianca}</Text>
              <Text>
                Data:{" "}
                {new Date(item.data_hora).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Nenhum alerta.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  tipo: { fontWeight: "bold", color: "#d9534f" },
  cachorro: { fontSize: 16, marginVertical: 4 },
});
