import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform, // Importe o KeyboardAvoidingView
} from "react-native";
import CheckBox from "react-native-checkbox";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

// Importe a função cadastrarUsuario do seu controlador aqui
import UsuarioController from "../../Controller/UsuarioController";
import RadioButton from "../components/RadioButton";

export function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [urlPerfil, setUrlPerfil] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  // Função para lidar com o cadastro
  const handleSignUp = async () => {
    // Verificar se o email já está cadastrado
    const isEmailRegistered = await UsuarioController.verificarEmail(email);

    const formattedDate = new Date(dataNascimento).toISOString().split('T')[0];
    console.log("data_nascimento:", formattedDate);
  
    console.log("nome_completo:", name);
    console.log("cpf:", cpf);
    console.log("email:", email);
    /* console.log("data_nascimento:", dataNascimento); */
    console.log("sexo:", sexo);
    console.log("senha:", password);
    console.log("repSenha:", confirmPassword);
    //console.log("urlPerfil:", urlPerfil);
    console.log("isChecked:", isChecked);

    if (isEmailRegistered) {
      // Email já cadastrado, mostrar uma mensagem de erro ao usuário
      console.error("Email já cadastrado.");
      // Você pode exibir uma mensagem de erro para o usuário aqui
    } else {
      // Email não cadastrado, continuar com o cadastro
      UsuarioController.cadastrarUsuario(
        email,
        password,
        name, 
        cpf, 
        formattedDate, 
        sexo
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-start  bg-[#2BB459]">
        {/* Campos de Cadastro */}

        <Text className="text-[#f1f1f1] font-bold text-2xl mt-[15%]">
          Cadastre-se
        </Text>

        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mt-[7%] mb-4 px-3">
          <MaterialIcons name="person-outline" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-9 pl-2 text-white"
            placeholder="Nome"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mb-4 px-3">
          <MaterialIcons name="mail-outline" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-10 pl-2 text-white"
            placeholder="CPF"
            placeholderTextColor="#fff"
            value={cpf}
            onChangeText={setCpf}
          />
        </View>

        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mb-4 px-3">
          <MaterialIcons name="mail-outline" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-10 pl-2 text-white"
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mb-4 px-3">
          <MaterialIcons name="credit-card" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-9 pl-2 text-white"
            placeholder="Data de Nascimento"
            placeholderTextColor="#fff"
            value={dataNascimento}
            onChangeText={setDataNascimento}
          />
        </View>

        <RadioButton
          options={["Masculino", "Feminino", "Outro"]}
          horizontal={true}
          onChangeSelect={(opt) => setSexo(opt)}
        />


        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mb-4 px-3">
          <MaterialIcons name="lock-outline" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-10 pl-2 text-white"
            placeholder="Senha"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-row w-10/12 items-center border-white border rounded-3xl mb-4 px-3">
          <MaterialIcons name="lock-outline" size={20} color="#fff" />
          <TextInput
            className="flex-1 h-10 pl-2 text-white"
            placeholder="Repetir Senha"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* CHECKBOX */}
        <TouchableOpacity
          className="flex-row w-10/12 items-center mb-2 pl-3"
          onPress={toggleCheckBox}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: "#fff",
              backgroundColor: isChecked ? "#fff" : "transparent",
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isChecked && (
              <MaterialIcons name="check" size={16} color="#2BB459" />
            )}
          </View>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
            Eu li e concordo com os termos
          </Text>
        </TouchableOpacity>

        {/* BOTÃO DE CADASTRO */}
        <TouchableOpacity
          className="w-10/12 h-10 items-center justify-center bg-[#fff] rounded-3xl mb-2 mt-3"
          onPress={handleSignUp}
        >
          <Text className="text-[#479962] font-bold text-lg">Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="items-center mt-4"
        >
          <View className="flex-row">
            <Text className="text-[#fff] font-semibold text-sm">
              Já tem uma conta?{" "}
            </Text>
            <Text className="text-[#2660A4] font-bold text-sm">Faça login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
