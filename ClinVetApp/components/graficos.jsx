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

export default function MetricsChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const screenWidth = Dimensions.get("window").width;
  const chartSize = screenWidth * 0.4;
  const paddingLeftCenter = screenWidth * 0.11; // centralização universal

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
    const interval = setInterval(() => carregarMetricas(), 10000);
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

  const coresClinvet = ["#8B5E3C", "#C27C52", "#E9C46A", "#F4A261"];

  const chartData = data.map((item, index) => ({
    name: item.nome_cachorro,
    population: Number(item.total_convulsoes),
    color: coresClinvet[index % coresClinvet.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <TouchableOpacity
      onPress={() => router.push("/graficos")}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#F8F8F8",
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 22,
        shadowColor: "#000",
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 0,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 17,
          fontWeight: "700",
          color: "#4A3B31",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Convulsões por cachorro (último mês)
      </Text>

      {/* GRÁFICO CENTRALIZADO */}
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <PieChart
          data={chartData}
          width={chartSize}
          height={chartSize}
          accessor="population"
          backgroundColor="transparent"
          hasLegend={false}
          center={[0, 0]}
          paddingLeft={paddingLeftCenter}
          absolute
          chartConfig={{
            color: () => "#000",
          }}
        />
      </View>

      {/* LEGENDA */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 2,
          flexWrap: "wrap",
        }}
      >
        {chartData.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                borderRadius: 3,
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 14, color: "#333" }}>{item.name}</Text>
          </View>
        ))}
      </View>

      {/* TABELA EM ROW */}
      <View
        style={{
          width: "100%",
          marginTop: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "55%",
          }}
        >
          {chartData.map((item, i) => (
            <View
              key={i}
              style={{
                alignItems: "center",
                width: "50%",
              }}
            >
              {/* NÚMEROS */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: item.color,
                  marginBottom: 4,
                }}
              >
                {item.population}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
