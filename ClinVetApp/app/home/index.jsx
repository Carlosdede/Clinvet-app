import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Bell } from "lucide-react-native";
import MetricsChart from "../graficos/metricas";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/customHeader";
import { endpoints } from "../../src/api/endpoints";
import api from "../../src/api/api";

export default function Home() {
  const userName = "Carlos";
  const [metrics, setMetrics] = useState([]);
  const navigation = useNavigation();

  async function carregarMetricas() {
    try {
      const { data } = await api.get(endpoints.metricsConvulsoes);
      setMetrics(data);
    } catch (error) {
      console.log("Erro ao buscar métricas na Home:", error.message);
    }
  }

  useEffect(() => {
    carregarMetricas();
    const interval = setInterval(carregarMetricas, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const cards = [
    {
      title: "Alertas",
      icon: require("../../assets/icons/alerta.png"),
      href: "/alerts",
    },
    {
      title: "Cameras",
      icon: require("../../assets/icons/camera.png"),
      href: "/cameras",
    },
    {
      title: "Pacientes",
      icon: require("../../assets/icons/dog.png"),
      href: "/dogs",
    },
    {
      title: "Baias",
      icon: require("../../assets/icons/baia.png"),
      href: "/baias",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar style="light" backgroundColor="#6B4C3A" />

      <CustomHeader title="ClinVet Security" userName="Carlos" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, padding: 18 }}
      >
        {/* CARD DO GRÁFICO */}
        <View
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 20,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 24,
          }}
        >
          <MetricsChart data={metrics} />
        </View>

        {/* GRID DE CARDS */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {cards.map((item, i) => (
            <Link href={item.href} asChild key={i}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  width: "47%",
                  backgroundColor: "#E9E9E9",
                  borderRadius: 18,
                  marginBottom: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 30,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Image
                  source={item.icon}
                  style={{
                    width: 38,
                    height: 38,
                    marginBottom: 10,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "600",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
