import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import CustomHeader from "../../components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { endpoints } from "../../src/api/endpoints";
import api from "../../src/api/api";
import { StatusBar } from "expo-status-bar";

const largura = Dimensions.get("window").width - 20;

export default function GraficosDetalhados() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregarMetricas() {
    try {
      const { data } = await api.get(endpoints.metricsConvulsoes);
      setMetrics(data);
    } catch (error) {
      console.log("Error ao buscar métricas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMetricas();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6B4C3A" />
      </View>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nenhum dado disponível</Text>
      </View>
    );
  }

  const labels = metrics.map((m) => m.nome_cachorro);
  const values = metrics.map((m) => Number(m.total_convulsoes));
  const totalConv = values.reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#6B4C3A" }}
      edges={["top"]}
    >
      <StatusBar style="light" backgroundColor="#6B4C3A" />

      <CustomHeader title="Gráficos" userName="Carlos" />
      <View style={{ flex: 1, backgroundColor: "#FFF", padding: 16 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingTop: 50, //
          }}
          contentContainerStyle={{
            paddingBottom: 120, //
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
            Métricas Detalhadas
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Convulsões por cachorro
          </Text>
          <BarChart
            data={{
              labels,
              datasets: [{ data: values }],
            }}
            width={largura}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(107, 76, 58, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={{ borderRadius: 10, marginBottom: 24 }}
          />

          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Convulsões nos últimos 7 dias
          </Text>
          <LineChart
            data={{
              labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
              datasets: [{ data: [1, 2, 1, 3, 0, 2, 1] }],
            }}
            width={largura}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(194, 124, 82, ${opacity})`,
              labelColor: () => "#000",
            }}
            bezier
            style={{ borderRadius: 10, marginBottom: 24 }}
          />

          <View
            style={{
              backgroundColor: "#6B4C3A",
              borderRadius: 15,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>
              Cachorros monitorados
            </Text>
            <Text style={{ color: "#fff", fontSize: 36, fontWeight: "bold" }}>
              {labels.length}
            </Text>
            <Text style={{ color: "#f1f1f1" }}>
              Convulsões totais: {totalConv}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
