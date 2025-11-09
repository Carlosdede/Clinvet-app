import AsyncStorage from "@react-native-async-storage/async-storage";

export const CAMERA_KEY = "@clinvet:camera_url";

export const DEFAULT_CAMERA_URL = "http://192.168.10.113:5000/snapshot";

export async function getCameraUrl() {
  try {
    const saved = await AsyncStorage.getItem(CAMERA_KEY);
    return saved ?? DEFAULT_CAMERA_URL;
  } catch (e) {
    console.warn("Erro lendo camera url:", e);
    return DEFAULT_CAMERA_URL;
  }
}

export async function setCameraUrl(url) {
  try {
    await AsyncStorage.setItem(CAMERA_KEY, url);
    return true;
  } catch (e) {
    console.error("Erro salvando camera url:", e);
    return false;
  }
}

export async function clearCameraUrl() {
  try {
    await AsyncStorage.removeItem(CAMERA_KEY);
    return true;
  } catch (e) {
    console.error("Erro removendo camera url:", e);
    return false;
  }
}
