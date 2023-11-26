import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Fontisto";

import SplashScreen from "../screens/SplashScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { SignUpScreen } from "../screens/SignUpScreen";
import { ForgotPassScreen } from "../screens/ForgotPass/ForgotPassScreen";
import { RecoverPassScreen } from "../screens/ForgotPass/RecoverPassScreen";
import { VaccineScreen } from "../screens/VaccineScreen";
import { RemedyScreen } from "../screens/RemedyScreen";
import { HealthCenterScreen } from "../screens/HealthCenterScreen";
import { CalendarScreen } from "../screens/CalendarScreen";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#2BB459",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Início") {
            iconName = "home";
          } else if (route.name === "Remédios") {
            iconName = "pills";
          } else if (route.name === "Vacinas") {
            iconName = "calendar";
            /* injection-syringe */
          } else if (route.name === "Perfil") {
            iconName = "person";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Remédios"
        component={RemedyScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Vacinas"
        component={VaccineScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName="Splash">
      {isLoading ? (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPass"
            component={ForgotPassScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecoverPass"
            component={RecoverPassScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false}}
          />
          <Stack.Screen
            name="HealthCenter"
            component={HealthCenterScreen}
            options={{ headerShown: false}}
          />
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ headerShown: false}}
          />
          <Stack.Screen
            name="Tabs"
            component={MyTabs}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
