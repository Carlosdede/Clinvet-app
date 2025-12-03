import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    // ANDROID: garante canal
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("alerts", {
        name: "Alerts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    // Permissões
    let { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[notifications] Permissão não concedida. Sem token.");
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;

    let tokenData;
    if (projectId) {
      tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    } else {
      console.log(
        "[notifications] projectId não encontrado, tentando sem parâmetro."
      );
      tokenData = await Notifications.getExpoPushTokenAsync();
    }

    const token = tokenData.data;
    console.log("[notifications] EXPO PUSH TOKEN =>", token);
    return token;
  } catch (err) {
    console.log("[notifications] Erro ao registrar push:", err?.message || err);
    // se der ruim (emulador, etc), só volta null
    return null;
  }
}

export async function notifyAlert(alert) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Alerta detectado",
      body: `${(alert?.tipo || "evento").toUpperCase()} — ${
        alert?.nome_baia || "Baia"
      }`,
      data: alert || {},
      sound: true,
    },
    trigger: null,
  });
}
