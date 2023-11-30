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
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Sua Carteira:</Text>
        {/* Renderize aqui os detalhes da carteira do usuário, por exemplo: */}
        {carteiraUsuario && (
          <TouchableOpacity
            key={carteiraUsuario.id_carteira}
            onPress={() =>
              navigation.navigate("VaccinesUser", {
                id_carteira: Number(carteiraUsuario.id_carteira),
              })
            }
          >
            {carteiraUsuario.id_carteira && (
              <Text>ID: {carteiraUsuario.id_carteira}</Text>
            )}
            {carteiraUsuario.id_usuario && (
              <Text>ID do usuario: {carteiraUsuario.id_usuario}</Text>
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

    return (
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Carteiras de Dependentes:
        </Text>
        {carteirasDependentes.map((carteira) => (
          <TouchableOpacity
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
      
      {carteiras.length === 0 ? (
        <View>
          <Text className="ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
            Você ainda não possui nenhuma{"\n"} carteira ou vacina cadastrada.
          </Text>
          <Text className="mt-2 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
            Para adicionar uma nova, clique no botão{" "}
            <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>{" "}
            abaixo e{"\n"} digite as demais informações necessárias..
          </Text>
          <Image
            source={require("../../../assets/backgrounds/fundoVacina.png")}
            className="w-full top-[5%]"
          />

          <View className="flex flex-row w-full justify-center">
            <Image
              source={require("../../../assets/illustrations/flecha.png")}
              className="w-[160px] h-[150px] ml-16"
            />
          </View>

          <Modal isVisible={isModalVisible}>
            <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 2 }}
              >
                Criar sua carteira
              </Text>
              <Button
                title="Criar Carteira"
                disabled={isButtonDisabled}
                onPress={() => criarCarteira()}
              />
              <View
                style={{
                  height: 1,
                  backgroundColor: "gray",
                  marginVertical: 10,
                }}
              />
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
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "gray",
                    marginRight: 10,
                    padding: 5,
                  }}
                  placeholder="ID do Dependente"
                  keyboardType="numeric"
                  value={iddependente}
                  onChangeText={setiddependente}
                />
                <Button
                  title="Criar"
                  onPress={() => criarCarteiraDependente(Number(iddependente))}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <Button title="Cancelar" onPress={toggleModal} />
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <>
          <View>
            {renderCarteiraUsuario()}
            {renderCarteirasDependentes()}

            <Modal isVisible={isModalVisible}>
              <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 2 }}
                >
                  Criar sua carteira
                </Text>
                <Button
                  title="Criar Carteira"
                  disabled={isButtonDisabled}
                  onPress={() => criarCarteira()}
                />
                <View
                  style={{
                    height: 1,
                    backgroundColor: "gray",
                    marginVertical: 10,
                  }}
                />
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
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "gray",
                      marginRight: 10,
                      padding: 5,
                    }}
                    placeholder="ID do Dependente"
                    keyboardType="numeric"
                    value={iddependente}
                    onChangeText={setiddependente}
                  />
                  <Button
                    title="Criar"
                    onPress={() =>
                      criarCarteiraDependente(Number(iddependente))
                    }
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 20,
                  }}
                >
                  <Button title="Cancelar" onPress={toggleModal} />
                </View>
              </View>
            </Modal>
          </View>
        </>
      )}
    </View>
  );
}
