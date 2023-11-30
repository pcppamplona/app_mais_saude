import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import UsuarioController from "../../Controller/UsuarioController";
import { usuarioSessao } from "./LoginScreen";
import CarteiraController from "../../Controller/CarteiraController";
import carteiraDependenteController from "../../Controller/carteiraDependenteController";

export function VaccineScreen({ navigation }) {
  const [carteiras, setCarteiras] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [iddependente, setiddependente] = useState("");

  const [searchText, setSearchText] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

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

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
  };

  const toggleModal = () => {
    console.log("foi?");
    setIsModalVisible(!isModalVisible);
    console.log(isModalVisible);
  };

  async function criarCarteira() {
    try {
      const cadastrarCarteira = await CarteiraController.cadastrarCarteira(
        usuarioSessao
      );
      setIsModalVisible(false);
      setButtonDisabled(true);
      fetchData();
    } catch (error) {
      throw error;
    }
  }

  async function criarCarteiraDependente(idDependente: number) {
    try {
      const cadastrarCarteiraDependente =
        await carteiraDependenteController.cadastrarCarteiraDependentes(
          idDependente
        );
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      throw error;
    }
  }

  const fetchData = async () => {
    const carteiraUsuario = await CarteiraController.buscarCarteira(
      usuarioSessao
    );
    console.log("Carteira usuario" + carteiraUsuario);

    const carteirasDependentes =
      await carteiraDependenteController.buscarCarteirasDependentes(
        usuarioSessao
      );
    console.log("Carteiras de dependentes" + carteirasDependentes);

    // Verifica se tanto a carteira do usuário quanto as carteiras de dependentes estão vazias
    if (!carteiraUsuario && !carteirasDependentes.length) {
      console.log("Nenhuma carteira encontrada.");
      setCarteiras([]); // Define o estado "carteiras" como um array vazio
    } else {
      // Atualiza o estado "carteiras" com as informações obtidas
      setCarteiras([carteiraUsuario, ...carteirasDependentes]);
      console.log(carteiras);
    }
  };

  useEffect(() => {
    fetchData(); // Chama a função para buscar as carteiras ao montar o componente
  }, []); // O array vazio assegura que o useEffect seja chamado apenas uma vez ao montar o componente

  const renderCarteiraUsuario = () => {
    const carteiraUsuario =
      carteiras.length > 0
        ? carteiras[0].find((carteira) => carteira && carteira.id_carteira)
        : null;

    // Verifica se há uma carteira de usuário e se o botão já está habilitado
    if (carteiraUsuario && !isButtonDisabled) {
      const hasCarteiraUsuario = carteiraUsuario.id_carteira;
      if (hasCarteiraUsuario) {
        setButtonDisabled(true);
      }
    }

    return (
      <View className="p-4 bg-[#5AD276] rounded-lg mb-4">
        <Text className="text-xl font-bold text-white mb-2">
          Sua Carteira
        </Text>
        {/* Renderize aqui os detalhes da carteira do usuário, por exemplo: */}
        {carteiraUsuario && (
          <TouchableOpacity
            className="bg-white p-4 rounded-lg"
            key={carteiraUsuario.id_carteira}
            onPress={() =>
              navigation.navigate("VaccinesUser", {
                id_carteira: Number(carteiraUsuario.id_carteira),
              })
            }
          >
            {/* {carteiraUsuario.id_carteira && (
              <Text>ID: {carteiraUsuario.id_carteira}</Text>
            )} */}
            <Text className="font-bold text-base text-[#28282D]">{name}</Text>
            {carteiraUsuario.id_usuario && (
              <Text className="font-bold text-sm text-[#727275]">Usuário: {carteiraUsuario.id_usuario}</Text>
            )}
            {carteiraUsuario.id_carteira && (
              <Text className="font-bold text-sm text-[#727275]">Carteira: {carteiraUsuario.id_carteira}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

// Função para renderizar a seção de carteiras de dependentes
const renderCarteirasDependentes = () => {
  const carteirasDependentes = carteiras.filter(
    (carteira) => carteira.id_carteiraDependente
  );

  // Verifica se há carteiras de dependentes
  if (carteirasDependentes.length === 0) {
    return (
      <View className="p-4 bg-[#7EE88D] rounded-lg">
        <Text className="text-xl font-bold text-white mb-2">
          Carteiras dos Dependentes
        </Text>
        <Image
            source={require("../../../assets/backgrounds/fundoDependenteCarteira3.png")}
            className="w-full top-[5%] rounded-md"
        />
        <TouchableOpacity
          className="mt-4 w-24 h-6 bg-white rounded-md flex justify-center items-center"
          onPress={() => navigation.navigate("Dependentes")}
        >
          <Text className="text-[#42CC7C] font-semibold text-xs">
            Dependentes
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderiza as carteiras de dependentes
  return (
    <View className="p-4 bg-green-500 rounded-lg">
      <Text className="text-xl font-bold text-white mb-2">
        Carteiras de Dependentes
      </Text>
      {carteirasDependentes.map((carteira) => (
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-2"
          key={carteira.id_carteiraDependente}
          onPress={() =>
            navigation.navigate("VaccinesDependent", {
              id_carteiraDependente: carteira.id_carteiraDependente,
            })
          }
        >
          <Text>
            ID da Carteira Dependente: {carteira.id_carteiraDependente}
          </Text>
          <Text>Id do dependente:{carteira.id_dependente}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
  return (
    <View className="flex-1 flex-col bg-[#fff]">
      <TouchableOpacity
        onPress={() => toggleModal()}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 1,
          width: 40,
          height: 40,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2BB459",
        }}
      >
        <Icon name="post-add" size={22} color="white" />
      </TouchableOpacity>
      <View className="flex flex-row w-full justify-between items-center mr-auto py-8 px-4">
        <Text className="font-bold text-2xl text-[#28282D]">Vacinas</Text>
        <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
      </View>

      {carteiras.length === 0 || (carteiras[0] && carteiras[0].length === 0) ? (
        <View>
          <Text className="ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
            Você ainda não possui nenhuma{"\n"}carteira ou vacina cadastrada.
          </Text>
          <Text className="ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
            Para adicionar uma carteira, clique no botão{" "}
            <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>{" "}
            abaixo.
          </Text>
          <Image
            source={require("../../../assets/backgrounds/fundoVacina2.png")}
            className="w-full top-[5%]"
          />

          <Modal isVisible={isModalVisible}>
            <View className="flex flex-col bg-white p-5 h-500 m-7 justify-center items-center rounded-xl">
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Criar sua Carteira
              </Text>
              <TouchableOpacity
                className="w-full rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
                disabled={isButtonDisabled}
                onPress={() => criarCarteira()}
              >
                <Text className="text-white text-sm font-bold">
                  Criar Carteira
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 30 }}>
                Criar carteira para dependente
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TextInput
                  className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg"
                  placeholder="ID do Dependente"
                  keyboardType="numeric"
                  value={iddependente}
                  onChangeText={setiddependente}
                />
              </View>
              <View className="flex flex-row justify-between mt-5 w-11/12">
                <TouchableOpacity
                  className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
                  onPress={() => criarCarteiraDependente(Number(iddependente))}
                >
                  <Text className="text-white text-sm font-bold">Criar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#d25a5a]"
                  onPress={toggleModal}
                >
                  <Text className="text-white text-sm font-bold">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View className="p-4">
          {renderCarteiraUsuario()}
          
          <View className="w-full h-[1px] bg-gray-300 flex flex-row justify-center mb-4"></View>

          {renderCarteirasDependentes()}

          <Modal isVisible={isModalVisible}>
            <View className="flex flex-col bg-white p-5 h-300 m-7 justify-center items-center rounded-xl">
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Criar carteira para dependente
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TextInput
                  className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-md"
                  placeholder="ID do Dependente"
                  keyboardType="numeric"
                  value={iddependente}
                  onChangeText={setiddependente}
                />
              </View>
              <View className="flex flex-row justify-between mt-5 w-11/12">
                <TouchableOpacity
                  className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
                  onPress={() => criarCarteiraDependente(Number(iddependente))}
                >
                  <Text className="text-white text-sm font-bold">
                    Criar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#d25a5a]"
                  onPress={toggleModal}
                >
                  <Text className="text-white text-sm font-bold">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}
