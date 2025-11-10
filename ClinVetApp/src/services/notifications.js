import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alerts", {
      name: "Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return status === "granted";
}

export async function notifyAlert(alert) {
  // alert: { tipo, nome_baia, confianca, data_hora }
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
