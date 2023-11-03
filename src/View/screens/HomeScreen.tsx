import React from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native"; 
import { usuarioSessao } from './LoginScreen';

export function HomeScreen() {
  // const route = useRoute();
  // const { usuarioId } = route.params as { usuarioId: number | null };
  
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-red-700">Home</Text>
      <Text>ID do Usuário: {usuarioSessao}</Text>
    </View>
  );
}
