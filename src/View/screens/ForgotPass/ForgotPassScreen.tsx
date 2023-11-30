import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TextInput } from "react-native-paper";
import UsuarioController from "../../../Controller/UsuarioController";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";

export function ForgotPassScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodigoEditable, setIsCodigoEditable] = useState(false);
  const [textCodigo, setTextCodigo] = useState("Enviar Código");
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isBtnCodigoDisabled, setIsBtnCodigoDisabled] = useState(true);
  const [isBtnPasswordDisabled, setIsBtnPasswordDisabled] = useState(true);
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [codigoEmail, setCodigoEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleVerificaEmail = async () => {
    if (email.length > 0) {
      const isEmailRegistered = await UsuarioController.verificarEmail(email);

      if (isEmailRegistered) {
        setIsEmailVerified(true);
        setIsBtnCodigoDisabled(false);
      } else {
        alert("Email não cadastrado!");
      }
    }
  };

  const handleEnviarCodigo = async () => {
    if (textCodigo === "Enviar Código") {
      setTextCodigo("Confirmar Código");
      setIsCodigoEditable(true);

      try {
        const codigo = await UsuarioController.CodigoAleatorio(email);

        if (codigo) {
          console.log("Código de verificação atual:", codigo);
          setCodigoEmail(codigo);
        } else {
          console.error("Código de verificação não recebido");
          setCodigoEmail("");
        }
      } catch (error) {
        console.error("Erro ao enviar código:", error);
      }
    } else if (textCodigo === "Confirmar Código") {
      if (codigoDigitado === codigoEmail) {
        setIsPasswordEditable(true);
        setIsBtnPasswordDisabled(false);
      } else if (codigoDigitado !== codigoEmail) {
        alert("Código está INCORRETO!");
      }
    }
  };

  const handleAtualizarSenha = async () => {
    if (newPassword.length > 5) {
      try {
        await UsuarioController.AtualizarSenha(email, newPassword);
        alert("Senha atualizada com sucesso!");
        navigation.navigate("Login");
      } catch (error) {
        console.error("Erro ao atualizar senha:", error);
      }
    } else {
      alert("Digite uma senha maior!");
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
            source={require("../../../../assets/illustrations/forgot-password.png")}
            className="w-[200] h-[200px] absolute top-[20%]"
          />
        </View>

        <Text className="text-black font-bold text-lg mt-[15%] mb-8">Esqueci minha senha</Text>

        <View className="w-5/6">
          <TextInput
            className="flex-1 h-12 bg-white rounded-lg px-4 border border-gray-300 mr-2"
            placeholder="Digite seu email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TouchableOpacity
            className="w-full h-12 bg-green-500 rounded-lg items-center justify-center mt-4"
            onPress={handleVerificaEmail}
          >
            <Text className="text-white font-bold text-lg">
              Verificar Email
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center w-5/6 mt-10">
          <TextInput
            value={codigoDigitado}
            onChangeText={(text) => setCodigoDigitado(text)}
            placeholder="Digite o código"
            className="flex-1 h-12 text-sm bg-white rounded-lg px-4 border border-gray-300 mr-2"
            editable={isCodigoEditable}
          />

          <TouchableOpacity
            className="w-1/3 h-12 bg-green-500 rounded-lg items-center justify-center"
            onPress={handleEnviarCodigo}
            disabled={isBtnCodigoDisabled}
          >
            <Text className="text-white font-bold">{textCodigo}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center w-5/6 mt-4">
          <TextInput
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Digite uma nova senha"
            className="flex-1 h-12 text-sm bg-white rounded-lg px-4 border border-gray-300 mr-2"
            editable={isPasswordEditable}
          />

          <TouchableOpacity
            className="w-1/3 h-12 bg-green-500 rounded-lg items-center justify-center"
            disabled={isBtnPasswordDisabled}
            onPress={handleAtualizarSenha}
          >
            <Text className="text-white font-bold">Atualizar senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
