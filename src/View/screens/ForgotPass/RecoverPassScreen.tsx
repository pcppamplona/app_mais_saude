import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { usuarioSessao } from "../LoginScreen";
import UsuarioController from "../../../Controller/UsuarioController";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import Icon from "react-native-vector-icons/Fontisto";

export function RecoverPassScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaSenhaEditable, setNovaSenhaEditable] = useState(false);
  const [btnNovaDisabled, setBtnNovaDisabled] = useState(true);
  const id_usuario = usuarioSessao;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleVericarSenha = async () => {
    try {
      const senha = await UsuarioController.verificarSenha(
        id_usuario,
        senhaAtual
      );

      if (senha) {
        alert("Senha encontrada!");
        setNovaSenhaEditable(true);
        setBtnNovaDisabled(false);
      } else {
        alert("Senha inválida!");
        setNovaSenhaEditable(false);
        setBtnNovaDisabled(true);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleAtualizarSenha = async () => {
    if (novaSenha.length < 5) {
      alert("Digite uma senha maior");
    } else if (novaSenha.length > 5) {
      try {
        await UsuarioController.AtualizarNovaSenha(id_usuario, novaSenha);
        alert("Senha atualizada");
      } catch (error) {
        console.error("Erro:", error);
        alert(error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-start">
        {/* Container com a imagem */}
        <View className="w-full h-[30%] items-center bg-[#2BB459] relative">
          <View className="mt-7 mr-auto bg-[#2BB459] w-full">
            <TouchableOpacity
              className="ml-4"
              onPress={() => navigation.goBack()}
            >
              <Icon name="angle-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image
            source={require("../../../../assets/illustrations/login.png")}
            className="w-[370px] h-[250px] absolute top-[25%] bottom-0 animate-pulse"
          />
        </View>
        <View className="mt-24">
          <Text className="text-black font-bold text-2xl">Atualizar Senha</Text>
        </View>

        <View className="flex-row w-10/12 items-center bg-white border-[#9E9EA0] border rounded-3xl mt-4 mb-4 px-3">
          <MaterialIcons name="lock-outline" size={20} color="#9E9EA0" />
          <TextInput
            className="flex-1 h-12 pl-2 font-medium text-black bg-white rounded-3xl"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={(text) => setSenhaAtual(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color="#9E9EA0"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            width: "80%",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2BB459",
            borderRadius: 30,
            marginBottom: 10,
          }}
          onPress={handleVericarSenha}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Verificar Senha
          </Text>
        </TouchableOpacity>

        <View className="flex-row w-10/12 items-center bg-white border-[#9E9EA0] border rounded-3xl mt-9 mb-4 px-3">
          <MaterialIcons name="lock-outline" size={20} color="#9E9EA0" />
          <TextInput
            className="flex-1 h-12 pl-2 font-medium text-black bg-white rounded-3xl"
            placeholder="Digite uma nova senha"
            value={novaSenha}
            onChangeText={(text) => setNovaSenha(text)}
            editable={novaSenhaEditable}
          />
        </View>
        <TouchableOpacity
          style={{
            width: "80%",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2BB459",
            borderRadius: 30,
            marginBottom: 10,
          }}
          onPress={handleAtualizarSenha}
          disabled={btnNovaDisabled}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Atualizar Senha
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
