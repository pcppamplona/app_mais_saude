import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";

export function HealthCenterScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
        <View className="mt-10 ml-4 mr-auto">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
      </View>
      <Text className="text-red-700">Posto de Sáude</Text>
    </View>
  );
}
