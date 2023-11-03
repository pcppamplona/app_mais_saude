import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import * as ImagePicker from "expo-image-picker";
import { usuarioSessao } from './LoginScreen';
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
  const [password, setPassword] = useState(""); // Novo estado para a senha
  const [cpf, setCpf] = useState(""); // Novo estado para o CPF
  const [infoUsuario, setInfoUsuario] = useState<UsuarioData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<UsuarioData | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
  


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
    const usuarioInfo  = await UsuarioController.getUsuarioPorId(usuarioSessao);
    setInfoUsuario(usuarioInfo);
    setEditedInfo(usuarioInfo);
    console.log(infoUsuario)
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
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    } finally {
      // Feche o modal independentemente do resultado da exclusão
      navigation.navigate('Login');
      toggleModal();
    }
  };

  // Função para alternar entre a confirmação de exclusão e o campo de senha
  const toggleDeletionConfirmation = () => {
    setIsConfirmingDeletion(!isConfirmingDeletion);
  };

  return (
    <View className="flex-1 items-center bg-white">
      <View className="bg-[#1F9A55] border-[#1F9A55] border-2 w-28 h-28 items-center justify-center mt-[10%] rounded-full">
        {image ? (
          <Image source={{ uri: image }} className="w-28 h-28 rounded-full" />
        ) : (
          <View className="items-center justify-center">
            <Icon name="person" size={60} color="white" />
          </View>
        )}
      </View>

      <TouchableOpacity
        className="ml-20 items-center justify-center"
        onPress={pickImage}
      >
        <SimpleIcon name="arrow-up-circle" size={18} color="#9E9EA0" />
      </TouchableOpacity>

      <View>
      <Text>Nome:</Text>
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
          <Text>{infoUsuario ? infoUsuario.Nome_Completo : "Carregando..."}</Text>
        </View>
      )}
    </View>

      <View className="w-full mt-6">
        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
          <Icon name="email" size={23} color="#9E9EA0" className="mr-2" />
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
              <Text>{infoUsuario ? infoUsuario.Email : "Carregando..."}</Text>
            </View>
          )}
        </View>


        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
        <Icon name="date" size={23} color="#9E9EA0" className="mr-2" />
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
              <Text>{infoUsuario ? infoUsuario.Data_Nascimento : "Carregando..."}</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
          <Icon name="gender" size={23} color="#9E9EA0" className="mr-2" />
          {isEditing ? (
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setInfoUsuario({ ...infoUsuario, Sexo: "Masculino" })}
                style={{ marginRight: 20 }}
              >
                <Text>Homem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInfoUsuario({ ...infoUsuario, Sexo: "Feminino" })}
              >
                <Text>Mulher</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text className="text-base ml-3 text-[#9E9EA0]">
                {infoUsuario ? infoUsuario.Sexo : "Carregando..."}
              </Text>
            </View>
          )}
        </View>


        {/* Campo de Senha */}
      {/* <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
        <Icon name="key" size={23} color="#9E9EA0" className="mr-2" />
        <Text className="text-base ml-3 text-[#9E9EA0]">Senha: {password}</Text>
      </View> */}

      {/* Campo de CPF */}

      <View className="flex-row items-center justify-start pl-4 pr-4 mt-4">
        <Icon name="user" size={23} color="#9E9EA0" className="mr-2" />
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
              <Text>{infoUsuario ? infoUsuario.CPF : "Carregando..."}</Text>
            </View>
          )}
        </View>


        
        {/* <TouchableOpacity
          className="flex-row items-center justify-start mt-8 pt-6 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
          onPress={() => {
            console.log("Settings pressed!");
          }}
        >
          <Icon
            name="player-settings"
            size={23}
            color="#479962"
            className="mr-2"
          />
          <Text className="text-base font-bold ml-3 text-[#479962]">
            Configurações
          </Text>
        </TouchableOpacity> */}

        {/* BOTÃO REDEFINIR A SENHA */}
        {/* <TouchableOpacity
          className="flex-row items-center justify-start mt-6 pt-6 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
          onPress={() => {
            console.log("Redefinir pressed!");
          }}
        >
          <Icon name="locked" size={23} color="#727275" className="mr-2" />
          <Text className="text-base font-bold ml-3 text-[#727275]">
            Redefinir senha
          </Text>
        </TouchableOpacity> */}

        {/* bOTÃO DE LOGOUT */}
        {/* <TouchableOpacity
          className="flex-row items-center justify-start mt-6 pt-6 pl-4 pr-4 border-t-[1px] border-[#EAEAEA]"
          onPress={() => {
            console.log("Logout pressed!");
          }}
        >
          <Icon name="power" size={23} color="#FF183F" className="mr-2" />
          <Text className="text-base font-bold ml-3 text-[#FF183F]">
            Redefinir senha
          </Text>
        </TouchableOpacity> */}

<TouchableOpacity
  onPress={() => {
    if (isEditing) {
      // Se estiver editando, chame a função handleSave
      handleSave();
    } else {
      // Se não estiver editando, alterne o modo de edição
      setIsEditing(true);
    }
  }}
  style={{
    backgroundColor: isEditing ? "#1F9A55" : "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  }}
>
  <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
    {isEditing ? "Salvar" : "Editar"}
  </Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('RecoverPass')}>
        <Text style={{ color: '#9E9EA0', fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
          Atualizar Senha
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={toggleModal}
        style={{
          backgroundColor: "#FF3B30",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          Excluir Conta
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            {/* Verifica se a confirmação de exclusão está ativa */}
            {isConfirmingDeletion ? (
              <View>
                <Text>Digite sua senha:</Text>
                <TextInput
                  secureTextEntry
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Button title="Confirmar" onPress={handleConfirmDelete} />
                  <Button title="Cancelar" onPress={toggleModal} />
                </View>
              </View>
            ) : (
              <View>
                <Text>Tem certeza de que deseja excluir sua conta?</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Button title="Sim" onPress={toggleDeletionConfirmation} />
                  <Button title="Não" onPress={toggleModal} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      </View>
    </View>
  );
}
