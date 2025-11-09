import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  getCameraUrl,
  setCameraUrl,
  clearCameraUrl,
  DEFAULT_CAMERA_URL,
} from "../../utils/cameraConfig";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraConfigScreen() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    (async () => {
      const current = await getCameraUrl();
      setUrl(current);
    })();
  }, []);

  const salvar = async () => {
    if (!url) return Alert.alert("Erro", "Informe a URL da câmera.");
    const ok = await setCameraUrl(url.trim());
    if (ok) Alert.alert("Sucesso", "URL salva.");
    else Alert.alert("Erro", "Não foi possível salvar a URL.");
  };

  const restaurar = async () => {
    await clearCameraUrl();
    setUrl(DEFAULT_CAMERA_URL);
    setPreview(null);
    Alert.alert("OK", "URL restaurada para o padrão.");
  };

  const testar = async () => {
    setLoading(true);
    setPreview(null);
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const json = await resp.json();
      if (!json.image) throw new Error("Resposta não contém campo 'image'");
      setPreview(json.image);
    } catch (e) {
      Alert.alert("Erro ao testar", String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>URL da câmera (snapshot)</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Ex: http://192.168.x.y:5000/snapshot"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 6,
          }}
        />

        <View style={{ height: 12 }} />

        <Button title="Salvar URL" onPress={salvar} />
        <View style={{ height: 8 }} />
        <Button title="Restaurar para padrão" onPress={restaurar} />
        <View style={{ height: 8 }} />

        <Button title="Testar URL (obter snapshot)" onPress={testar} />
        <View style={{ height: 12 }} />

        {loading && <ActivityIndicator size="large" />}

        {preview ? (
          <Image
            source={{ uri: preview }}
            style={{
              width: "100%",
              height: 200,
              resizeMode: "contain",
              marginTop: 8,
            }}
          />
        ) : (
          <Text style={{ marginTop: 8, color: "#666" }}>Nenhuma prévia</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
