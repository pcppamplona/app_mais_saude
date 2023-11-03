import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import UsuarioController from "../../Controller/UsuarioController";

let usuarioSessao;
export { usuarioSessao };

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usuarioId, setUsuarioId] = useState<number>(0);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    console.log("Valor atualizado de usuarioId:", usuarioId);
    
    if (usuarioId) {
      // Navegar apenas quando o usuarioId estiver disponível
      console.log(usuarioId)
      usuarioSessao = usuarioId;
      navigation.navigate("Tabs");
    }
  }, [usuarioId, navigation]);

  const handleLogin = async () => {
    const userId = await UsuarioController.loginUsuario(email, password);
    if (userId !== undefined && userId !== null) {
      // Login bem-sucedido, navega para a tela "Tabs" (Home)
      console.log("valor do userId", userId)
      setUsuarioId(userId)
      //console.log(usuarioId)
      // navigation.navigate("Tabs", { usuarioId: userId});
    } else {
      // Login falhou, exiba uma mensagem de erro ou impeça a navegação
      // Exemplo de exibição de mensagem de erro:
      alert("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-start">
        {/* Container com a imagem */}
        <View className="w-full h-[30%] items-center bg-[#2BB459] relative">
          <Text className="text-[#f1f1f1] font-bold text-2xl mt-10">
            Bem-Vindo
          </Text>
          <Image
            source={require("../../../assets/illustrations/pharmacist.png")}
            className="w-[250px] h-[230px] absolute top-[50%] bottom-0 animate-pulse"
          />
        </View>

        <View className="flex-row w-10/12 items-center bg-white border-[#9E9EA0] border rounded-3xl mt-[40%] mb-4 px-3">
          <MaterialIcons name="person-outline" size={20} color="#9E9EA0" />
          <TextInput
            className="flex-1 h-12 pl-2 font-medium text-black bg-white rounded-3xl"
            placeholder="E-mail"
            placeholderTextColor="#9E9EA0"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="flex-row w-10/12 items-center bg-white border-[#9E9EA0] border rounded-3xl mb-4 px-3">
          <MaterialIcons name="lock-outline" size={20} color="#9E9EA0" />
          <TextInput
            className="flex-1 h-12 pl-2 font-medium text-black bg-white rounded-3xl"
            placeholder="Senha"
            placeholderTextColor="#9E9EA0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color="#9E9EA0"
            />
          </TouchableOpacity>
        </View>

        {/* BOTÃO DE TEXTO PARA FORGOTPASS */}
        <TouchableOpacity
          className="w-9/12 items-end"
          onPress={() => navigation.navigate("ForgotPass")}
        >
          <Text className="text-[#9E9EA0] font-semibold text-base mb-6">
            Esqueceu a senha
          </Text>
        </TouchableOpacity>

        {/* BOTÃO DE ENTRAR, MANDA PARA ROTA DE NAVEGAÇÃO SENDO NECESSÁRIO INTEGRAÇÃO */}
        <TouchableOpacity
          className="w-10/12 h-10 items-center justify-center bg-[#2BB459] rounded-3xl mb-2 mt-3"
          /* onPress={handleLogin} */
          onPress={(handleLogin)}
        >
          <Text className="text-white font-bold text-lg">Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          className="items-center mt-4"
        >
          <View className="flex-row">
            <Text className="text-[#9E9EA0] font-semibold text-sm mr-2">
              Não tem uma conta?
            </Text>
            <Text className="text-[#479962] font-bold text-sm">
              Cadastre-se
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
