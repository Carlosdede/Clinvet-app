import React, { useEffect, useRef } from "react";
import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../src/services/notifications";
import { initSocket } from "../src/services/socket";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const responseListener = useRef();

  useEffect(() => {
    (async () => {
      const granted = await registerForPushNotificationsAsync();
      if (!granted) {
        console.log("Permissão de notificação negada.");
      } else {
        console.log("Notificações habilitadas.");
      }

      initSocket();
    })();

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notificação clicada:", response);
        router.push("/home");
      });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="baias" />
      <Stack.Screen name="dogs" />
      <Stack.Screen name="graficos" />
    </Stack>
  );
}
