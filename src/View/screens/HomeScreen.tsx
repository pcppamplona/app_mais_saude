import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { usuarioSessao } from "./LoginScreen";
import Icon from "react-native-vector-icons/Fontisto";
import Icon2 from "react-native-vector-icons/FontAwesome";
import UsuarioController from "../../Controller/UsuarioController";


export function HomeScreen({ navigation }) {
  const [name, setName] = useState("");

  useEffect(() => {
    getName();
  }, []);

  async function getName() {
    try {
      const nome = await UsuarioController.getUsuarioPorId(usuarioSessao);
      setName(nome.Nome_Completo);
    } catch (error) {
      throw error;
    }
  }

  return (
    <View className="flex-1 bg-[#fff]">
      <View className="flex flex-row items-center ml-4 mr-auto mt-12 mb-4">
        <Image
          source={require("../../../assets/logo.png")}
          style={{ width: 32, height: 30 }}
        />
        <Text className="font-normal text-xl text-[#28282D]">Olá, </Text>

        <Text className="font-bold text-xl text-[#28282D]">{name}</Text>
        <View className="flex-1 flex-row justify-end">
          <TouchableOpacity>
            <Icon2
              name="bell"
              size={22}
              color="#9e9ea0"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[2px] w-11/12 ml-auto mr-auto bg-[#EAEAEA]" />
      <Text style={{ color: "red" }}>Home</Text>
      <Text>ID do Usuário: {usuarioSessao}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("HealthCenter pressed!");
          navigation.navigate("HealthCenter");
        }}
      >
        <Text>Posto de saúde</Text>
      </TouchableOpacity>
    </View>
  );
}
