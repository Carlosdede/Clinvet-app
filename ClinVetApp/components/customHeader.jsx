import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";

export default function CustomHeader({
  userName = "C",
  title = "ClinVet Security",
}) {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#6B4C3A",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        alignSelf: "center",
      }}
    >
      <Text
        style={{
          color: "#FFF",
          fontSize: 18,
          fontWeight: "700",
          textAlign: "left",
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <TouchableOpacity>
          <Bell color="white" size={22} />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#FFF",
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#6B4C3A", fontWeight: "700", fontSize: 16 }}>
            {userName[0].toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}
