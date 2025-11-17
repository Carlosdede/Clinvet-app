import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import api from "../src/api/api";
import { endpoints } from "../src/api/endpoints";

const largura = Dimensions.get("window").width - 40;

export default function MetricsChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function carregarMetricas() {
    try {
      const { data } = await api.get(endpoints.metricsConvulsoes);
      setData(data);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    carregarMetricas();

    const interval = setInterval(() => {
      carregarMetricas();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={{ alignItems: "center", padding: 20 }}>
        <ActivityIndicator size="large" color="#6B4C3A" />
      </View>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={{ alignItems: "center", padding: 20 }}>
        <Text style={{ color: "#6B4C3A" }}>Sem dados para exibir</Text>
      </View>
    );
  }

  const cores = [
    "#8B5E3C",
    "#C27C52",
    "#E9C46A",
    "#F4A261",
    "#E76F51",
    "#2A9D8F",
    "#264653",
  ];

  const chartData = data.map((item, index) => ({
    name: item.nome_cachorro,
    population: Number(item.total_convulsoes),
    color: cores[index % cores.length],
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  return (
    <TouchableOpacity
      onPress={() => router.push("/graficos")}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#F8F8F8",
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 30,
        shadowColor: "#000",
        shadowRadius: 3,
        elevation: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#4A3B31",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Convulsões por cachorro (último mês)
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: largura / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart
            data={chartData}
            width={largura / 1.6}
            height={140}
            accessor={"population"}
            backgroundColor={"transparent"}
            hasLegend={false}
            paddingLeft={"25"}
            center={[0, 0]}
            absolute
            chartConfig={{
              color: () => "#000",
            }}
          />
        </View>

        <View style={{ flex: 1, paddingLeft: 10 }}>
          {chartData.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: 3,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 13, color: "#333" }}>
                {item.name}: {item.population}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
