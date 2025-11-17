import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../src/services/notifications";
import { initSocket } from "../src/services/socket";
import * as NavigationBar from "expo-navigation-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const responseListener = useRef(null);

  useEffect(() => {
    (async () => {
      const granted = await registerForPushNotificationsAsync();
      if (granted) {
        console.log("Notificações habilitadas.");
      } else {
        console.log("Permissão de notificação negada.");
      }

      initSocket();
    })();

    NavigationBar.setBackgroundColorAsync("transparent");
    NavigationBar.setButtonStyleAsync("light");

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
    <>
      <StatusBar backgroundColor="#6B4C3A" style="light" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="alerts" />
        <Stack.Screen name="baias" />
        <Stack.Screen name="dogs" />
        <Stack.Screen name="graficos" />
      </Stack>
    </>
  );
}
