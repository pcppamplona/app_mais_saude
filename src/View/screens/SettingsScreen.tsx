import React from "react";
import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";

export function SettingsScreen({ navigation }) {
  return (
    <View className="flex-1 flex-col">
    
      <View className="mt-10 ml-4 mr-auto">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
      </View>

      <View className="ml-auto mr-auto mt-10 mb-10">
        <Text className="font-bold text-2xl text-[#28282D]">
          Configurações
        </Text>
      </View>

      {/* CONFIGURAÇÕES DA CONTA */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-10 py-5 border-t-2 border-[#EAEAEA]"
        onPress={() => {
          console.log("");
          navigation.navigate("");
        }}
      >
        <View className="flex-row items-center">
          <Icon
            name="person"
            size={20}
            color="#727275"
            style={{ marginRight: 12 }}
          />
          <Text className="text-base font-bold text-[#727275]">
            Configurações da conta
          </Text>
        </View>
        <Icon name="angle-right" size={20} color="#727275" />
      </TouchableOpacity>

      {/* NOTIFICAÇÕES */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-10 py-5 border-t-2 border-[#EAEAEA]"
        onPress={() => {
          console.log("");
          navigation.navigate("");
        }}
      >
        <View className="flex-row items-center">
          <Icon2
            name="notifications"
            size={21}
            color="#727275"
            style={{ marginRight: 11 }}
          />
          <Text className="text-base font-bold text-[#727275]">
            Notificações
          </Text>
        </View>
        <Icon name="angle-right" size={20} color="#727275" />
      </TouchableOpacity>

      {/* APARÊNCIA */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-10 py-5 border-t-2 border-[#EAEAEA]"
        onPress={() => {
          console.log("");
          navigation.navigate("");
        }}
      >
        <View className="flex-row items-center">
          <Icon2
            name="visibility"
            size={20}
            color="#727275"
            style={{ marginRight: 12 }}
          />
          <Text className="text-base font-bold text-[#727275]">Aparência</Text>
        </View>
        <Icon name="angle-right" size={20} color="#727275" />
      </TouchableOpacity>

      {/* AJUDA E SUPORTE */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-10 py-5 border-t-2 border-[#EAEAEA]"
        onPress={() => {
          console.log("");
          navigation.navigate("");
        }}
      >
        <View className="flex-row items-center">
          <Icon2
            name="headset-mic"
            size={20}
            color="#727275"
            style={{ marginRight: 12 }}
          />
          <Text className="text-base font-bold text-[#727275]">
            Ajuda e Suporte
          </Text>
        </View>
        <Icon name="angle-right" size={20} color="#727275" />
      </TouchableOpacity>

      {/* SOBRE */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-10 py-5 border-t-2 border-[#EAEAEA]"
        onPress={() => {
          console.log("");
          navigation.navigate("");
        }}
      >
        <View className="flex-row items-center">
          <Icon3
            name="information"
            size={20}
            color="#727275"
            style={{ marginRight: 12 }}
          />
          <Text className="text-base font-bold text-[#727275]">Sobre</Text>
        </View>
        <Icon name="angle-right" size={20} color="#727275" />
      </TouchableOpacity>
    </View>
  );
}
