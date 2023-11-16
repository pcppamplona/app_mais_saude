import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import Gen from "react-native-vector-icons/SimpleLineIcons";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import EditIcon from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { usuarioSessao } from "./LoginScreen";
import UsuarioController from "../../Controller/UsuarioController";

interface UsuarioData {
  id_usuario: number;
  Nome_Completo: string;
  Email: string;
  CPF: string;
  Data_Nascimento: string;
  Sexo: string;
  Imagem: string;
  // Adicione outras propriedades aqui, se necessário
}

export function ProfileScreen({ navigation }) {
  const [sex, setSex] = useState("feminino");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [infoUsuario, setInfoUsuario] = useState<UsuarioData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<UsuarioData | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);

  const [sexIcon, setSexIcon] = useState("symbol-male");
  useEffect(() => {
    if (sex === "feminino") {
      setSexIcon("symbol-female");
    } else {
      setSexIcon("symbol-male");
    }
  }, [sex]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      // Crie um objeto com as informações editadas
      const updatedInfo = {
        Nome_Completo: infoUsuario.Nome_Completo,
        Email: infoUsuario.Email,
        CPF: infoUsuario.CPF,
        Data_Nascimento: infoUsuario.Data_Nascimento,
        Sexo: infoUsuario.Sexo,
      };

      // Chame a função do controlador para atualizar o perfil
      await UsuarioController.atualizarPerfil(usuarioSessao, updatedInfo);

      // Atualize as informações na tela, se necessário
      // ...

      // Volte para a tela anterior ou faça a navegação desejada
      //navigation.goBack();
      setUpdateSuccess(true);
      await fetchUsuarioInfo();
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  // Função para buscar informações do usuário ao carregar a tela
  const fetchUsuarioInfo = async () => {
    const usuarioInfo = await UsuarioController.getUsuarioPorId(usuarioSessao);
    setInfoUsuario(usuarioInfo);
    setEditedInfo(usuarioInfo);
    console.log(infoUsuario);
  };

  // Chame a função para buscar informações ao carregar a tela
  useEffect(() => {
    fetchUsuarioInfo();
  }, [updateSuccess]);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    // Quando o modal for aberto, redefina o estado para a confirmação da exclusão
    setIsConfirmingDeletion(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // Aqui, você pode adicionar a lógica para confirmar a exclusão da conta.
      // Certifique-se de verificar a senha do usuário antes de prosseguir com a exclusão.

      // Se a exclusão for bem-sucedida, você pode redirecionar o usuário para a tela de login
      // ou realizar qualquer ação desejada.

      // Por enquanto, vamos apenas fechar o modal:
      await UsuarioController.ExcluirConta(usuarioSessao, password);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    } finally {
      // Feche o modal independentemente do resultado da exclusão
      navigation.navigate("Login");
      toggleModal();
    }
  };

  // Função para alternar entre a confirmação de exclusão e o campo de senha
  const toggleDeletionConfirmation = () => {
    setIsConfirmingDeletion(!isConfirmingDeletion);
  };

  return (
    <ScrollView className="bg-white">
      <TouchableOpacity
        className="mt-[10%] ml-auto mr-4"
        onPress={() => {
          if (isEditing) {
            // Se estiver editando, chame a função handleSave
            handleSave();
          } else {
            // Se não estiver editando, alterne o modo de edição
            setIsEditing(true);
          }
        }}
      >
        <EditIcon
          name={isEditing ? "check-square" : "edit"}
          size={25}
          color="#1F9A55"
        />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#1F9A55",
            width: 140,
            height: 140,
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 140, height: 140, borderRadius: 70 }}
            />
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Icon name="person" size={60} color="white" />
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="ml-20 items-center justify-center"
        onPress={pickImage}
      >
        <SimpleIcon name="arrow-up-circle" size={18} color="black" />
      </TouchableOpacity>

      {/* Informações do Campo Nome Usuário */}
      <View className="items-center justify-center">
        {isEditing ? (
          <View>
            <TextInput
              value={infoUsuario.Nome_Completo}
              onChangeText={(text) =>
                setInfoUsuario({ ...infoUsuario, Nome_Completo: text })
              }
            />
          </View>
        ) : (
          <View>
            <Text className="text-xl font-bold">
              {infoUsuario ? infoUsuario.Nome_Completo : "Carregando..."}
            </Text>
          </View>
        )}
        <Text className="text-gray-500">São Paulo, Brasil</Text>
      </View>

      <View className="w-full mt-6">
        {/* Informações do Campo Nome E-mail */}
        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
          <Icon name="email" size={18} color="#9E9EA0" className="mr-2" />
          {isEditing ? (
            <View>
              <TextInput
                className="text-base ml-3 text-[#9E9EA0]"
                value={infoUsuario.Email}
                onChangeText={(text) =>
                  setInfoUsuario({ ...infoUsuario, Email: text })
                }
              />
            </View>
          ) : (
            <View>
              <Text className="text-sm ml-3 text-[#9E9EA0]">
                {infoUsuario ? infoUsuario.Email : "Carregando..."}
              </Text>
            </View>
          )}
        </View>

        {/* Informações do Campo Nome CPF */}
        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
          <SimpleIcon name="user" size={18} color="#9E9EA0" className="mr-2" />
          {isEditing ? (
            <View>
              <TextInput
                className="text-base ml-3 text-[#9E9EA0]"
                value={infoUsuario.CPF}
                onChangeText={(text) =>
                  setInfoUsuario({ ...infoUsuario, CPF: text })
                }
              />
            </View>
          ) : (
            <View>
              <Text className="text-sm ml-3 text-[#9E9EA0]">
                {infoUsuario ? infoUsuario.CPF : "Carregando..."}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-start pl-4 pr-4 mt-4"
          onPress={() => {
            if (isEditing) {
              // Se estiver editando, alterne entre "masculino" e "feminino"
              setSex(sex === "masculino" ? "feminino" : "masculino");
            }
          }}
        >
          <Gen name={sexIcon} size={18} color="#9E9EA0" />
          {isEditing ? (
            <Text className="text-sm ml-3 text-[#9E9EA0]">
              {sex === "masculino" ? "Masculino" : "Feminino"}
            </Text>
          ) : (
            <Text className="text-sm ml-3 text-[#9E9EA0]">
              {infoUsuario ? infoUsuario.Sexo : "Carregando..."}
            </Text>
          )}
        </TouchableOpacity>

        {/* Informações do Campo Nome Data */}
        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
          <Icon name="date" size={18} color="#9E9EA0" className="mr-2" />
          {isEditing ? (
            <View>
              <TextInput
                className="text-base ml-3 text-[#9E9EA0]"
                value={infoUsuario.Data_Nascimento}
                onChangeText={(text) =>
                  setInfoUsuario({ ...infoUsuario, Data_Nascimento: text })
                }
              />
            </View>
          ) : (
            <View>
              <Text className="text-sm ml-3 text-[#9E9EA0]">
                {infoUsuario ? infoUsuario.Data_Nascimento : "Carregando..."}
              </Text>
            </View>
          )}
        </View>

        {/* BOTÃO DE CONFIGURAÇÕES */}
        {!isEditing && (
          <>
            {/* BOTÃO DE CONFIGURAÇÃO */}
            <TouchableOpacity
              className="flex-row items-center justify-start mt-2 pt-4 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
              onPress={() => {
                console.log("Settings pressed!");
                navigation.navigate("Settings");
              }}
            >
              <Icon
                name="player-settings"
                size={18}
                color="#479962"
                className="mr-2"
              />
              <Text className="text-sm font-bold ml-3 text-[#479962]">
                Configurações
              </Text>
            </TouchableOpacity>

            {/* BOTÃO REDEFINIR SENHA */}
            <TouchableOpacity
              className="flex-row items-center justify-start mt-4 pt-4 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
              onPress={() => {
                console.log("Redefinir pressed!");
                navigation.navigate("RecoverPass");
              }}
            >
              <Icon name="locked" size={18} color="#727275" className="mr-2" />
              <Text className="text-sm font-bold ml-3 text-[#727275]">
                Redefinir senha
              </Text>
            </TouchableOpacity>

            {/* BOTÃO LOGOUT */}
            <TouchableOpacity
              className="flex-row items-center justify-start mt-4 pt-4 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
              onPress={() => {
                console.log("Logout pressed!");
              }}
            >
              <Icon name="power" size={18} color="#FF183F" className="mr-2" />
              <Text className="text-sm font-bold ml-3 text-[#FF183F]">
                Sair
              </Text>
            </TouchableOpacity>
          </>
        )}

        {isEditing && (
          <>
            <TouchableOpacity
              className="flex-row items-center justify-start mt-6 pt-4 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
              onPress={toggleModal}
            >
              <Icon name="trash" size={18} color="#FF183F" className="mr-2" />
              <Text className="text-sm font-bold ml-3 text-[#FF183F]">
                Excluir conta
              </Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View
                className="flex-1 justify-center items-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View className="bg-white p-4 rounded-md">
                  {/* Conteúdo do seu modal */}
                  <Text className="text-base font-bold mb-2">
                    Tem certeza de que deseja excluir sua conta?
                  </Text>
                  <View className="flex flex-row justify-around">
                    <Button
                      title="Sim"
                      onPress={toggleDeletionConfirmation}
                      color="#FF183F"
                    />
                    <Button
                      title="Não"
                      onPress={() => setModalVisible(false)}
                      color="#007bff"
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </ScrollView>
  );
}
