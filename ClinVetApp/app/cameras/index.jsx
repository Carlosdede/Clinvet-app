import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getCameraUrl } from "../../utils/cameraConfig";
import { router } from "expo-router";

export default function CameraPreview() {
  const [previewOn, setPreviewOn] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraUrl, setCameraUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const url = await getCameraUrl();
      setCameraUrl(url);
    })();
  }, []);

  async function fetchSnapshot() {
    if (!cameraUrl) return;
    try {
      setLoading(true);
      const res = await fetch(cameraUrl);
      const json = await res.json();
      if (json.image) setImage(json.image);
    } catch (err) {
      console.warn("Erro ao buscar imagem:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let interval;
    if (previewOn) {
      fetchSnapshot();
      interval = setInterval(fetchSnapshot, 1500);
    }
    return () => clearInterval(interval);
  }, [previewOn, cameraUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Câmera 01</Text>

          <TouchableOpacity
            style={styles.configButton}
            onPress={() => router.push("/cameras/config")}
          >
            <Text style={styles.configText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.preview, styles.previewOff]}>
              <Text style={styles.previewOffText}>
                {loading ? "Carregando..." : "Prévia desligada"}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            previewOn ? styles.buttonStop : styles.buttonStart,
          ]}
          onPress={() => setPreviewOn((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {previewOn ? "Parar Prévia" : "Iniciar Prévia"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 40,
  },
  card: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#704C3A",
  },
  configButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#E6E6E6",
  },
  configText: { fontSize: 20 },
  previewContainer: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%", backgroundColor: "#EEE" },
  previewOff: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDD",
  },
  previewOffText: { color: "#777" },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonStart: { backgroundColor: "#4CAF50" },
  buttonStop: { backgroundColor: "#F44336" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
