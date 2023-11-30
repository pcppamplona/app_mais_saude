import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  Image,
} from "react-native";
import VacinaController from "../../Controller/VacinaController";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/Fontisto";
import Icon3 from "react-native-vector-icons/FontAwesome";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { TextInputMask } from "react-native-masked-text";
import DeleteIcon from "react-native-vector-icons/Fontisto";
import EditIcon from "react-native-vector-icons/FontAwesome5";

export function VaccinesUser({ route, navigation }) {
  const { id_carteira } = route.params;
  const [vacinas, setVacinas] = useState([]);

  const [nomeVacina, setNomeVacina] = useState("");
  const [localVacinacao, setlocalVacinacao] = useState("");
  const [dataVacinacao, setdataVacinacao] = useState("");
  const [dose, setDose] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditarModalVisible, setIsEditarModalVisible] = useState(false);

  const [vacinaSelecionada, setVacinaSelecionada] = useState(null);
  // State para verificar se existe algum card expandido
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    buscarVacinas();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openEditarModal = (
    id_vacina,
    Nome_Vacina,
    Local_Vacinacao,
    Data_Vacinacao,
    Dose
  ) => {
    console.log("Editar modal");
    setVacinaSelecionada({
      id_vacina,
      Nome_Vacina,
      Local_Vacinacao,
      Data_Vacinacao,
      Dose,
    });
    console.log(vacinaSelecionada);
    setIsEditarModalVisible(true);
    console.log(isEditarModalVisible);
  };

  async function converterFormatoData(input) {
    const partes = input.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    console.log("Data convertida:" + dataFormatada);
    return dataFormatada;
  }

  async function buscarVacinas() {
    try {
      const vacinas = await VacinaController.buscarVacina(id_carteira);
      setVacinas(vacinas);
    } catch (error) {
      throw error;
    }
  }

  async function cadastrarVacina(
    nomeVacina,
    localVacinacao,
    dataVacinacao,
    dose
  ) {
    toggleModal();
    const newData = await converterFormatoData(dataVacinacao);
    try {
      const cadastraVacina = await VacinaController.cadastrarVacina(
        id_carteira,
        nomeVacina,
        localVacinacao,
        newData,
        Number(dose)
      );
      await buscarVacinas();
    } catch (error) {
      throw error;
    }
  }

  async function editarVacina(
    idVacinaDependente,
    NomeVacina,
    LocalVacinacao,
    DataVacinacao,
    Dose
  ) {
    setIsEditarModalVisible(false);
    try {
      const editarVacina = await VacinaController.editarVacina(
        id_carteira,
        idVacinaDependente,
        NomeVacina,
        LocalVacinacao,
        DataVacinacao,
        Dose
      );
      await buscarVacinas();
    } catch (error) {
      throw error;
    }
  }

  async function excluirVacina(idVacina) {
    try {
      console.log("Excluindo vacina com id:" + idVacina);
      const excluirVacina = await VacinaController.excluirVacina(
        id_carteira,
        idVacina
      );
      await buscarVacinas();
    } catch (error) {
      throw error;
    }
  }

  //Lógica para fechar o expanded
  const toggleExpandedItem = (itemId) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemId ? null : itemId
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpandedItem(item.ID)}>
      <View className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md">
        <View className="flex flex-row items-center justify-start">
          <View className="flex w-10 h-10 justify-center items-center bg-gray-100 rounded-full mr-3">
            <View>
              <Image
                source={require("../../../assets/illustrations/vacinaIcon2.png")}
                className="w-10 h-10"
              />
            </View>
          </View>

          <View className="flex">
            <View className="flex flex-row items-center">
              <Text className="text-base font-bold">Vacina - </Text>
              <Text className="text-base font-bold">{item.Nome_Vacina}</Text>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-xs font-semibold">Data da Vacinação: </Text>
              <Text className="text-xs font-medium">{item.Data_Vacinacao}</Text>
            </View>
          </View>
        </View>

        {expandedItem === item.ID && (
          <>
            <View className="mt-2 ml-2">
              <Text className="mt-2">
                <Icon4 name="google-nearby" size={15} color="#7EE88D" /> Código
                da Vacina: {item.id_vacina}
              </Text>

              <Text className="mt-2">
                <Icon4 name="google-nearby" size={15} color="#7EE88D" /> Local
                da Vacinação: {item.Local_Vacinacao}
              </Text>

              <Text className="mt-2">
                <Icon4 name="google-nearby" size={15} color="#7EE88D" /> Dose:{" "}
                {item.Dose}
              </Text>
            </View>

            <View className="flex flex-row justify-start mt-6">
              <TouchableOpacity
                className="flex-row items-center p-2 bg-green-500 rounded-md"
                onPress={() =>
                  openEditarModal(
                    item.id_vacina,
                    item.Nome_Vacina,
                    item.Local_Vacinacao,
                    item.Data_Vacinacao,
                    item.Dose
                  )
                }
              >
                <Text className="mr-2 text-white font-semibold text-[11px]">
                  Editar
                </Text>
                <EditIcon name="edit" size={13} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex flex-row items-center rounded-md px-2 bg-[#FF183F] ml-5"
                onPress={() => excluirVacina(item.id_vacina)}
              >
                <Text className="mr-2 text-white font-semibold text-[11px]">
                  Excluir
                </Text>
                <DeleteIcon name="close" size={13} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

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
      <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon2 name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#28282D]">Suas Vacinas</Text>
        <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
      </View>

      <Modal isVisible={isModalVisible}>
        <View className="flex flex-col bg-white p-5 h-500 m-7 justify-center items-center rounded-xl">
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Informações da Vacina
          </Text>

          {/* Nome da Vacina */}
          <TextInput
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-4"
            placeholder="Nome da Vacina"
            value={nomeVacina}
            onChangeText={setNomeVacina}
          />

          {/* Local de Vacinação */}
          <TextInput
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
            placeholder="Local de Vacinação"
            value={localVacinacao}
            onChangeText={setlocalVacinacao}
          />

          {/* Data de Vacinação */}
          <TextInputMask
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
            placeholder="Data de Vacinação"
            value={dataVacinacao}
            type={"datetime"}
            options={{
              format: "DD/MM/YYYY",
            }}
            onChangeText={setdataVacinacao}
          />

          {/* Dose */}
          <TextInput
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
            placeholder="Dose"
            keyboardType="numeric"
            value={dose}
            onChangeText={setDose}
          />

          <View className="flex flex-row justify-between mt-5 w-11/12">
            <TouchableOpacity
              className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
              onPress={() => cadastrarVacina(nomeVacina, localVacinacao, dataVacinacao, dose)}
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
      <Modal isVisible={isEditarModalVisible}>
        {vacinaSelecionada && (
          <View className="flex flex-col bg-white p-5 h-700 m-7 justify-center items-center rounded-xl">
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Editar Informações da Vacina
            </Text>

            {/* Nome da Vacina */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Nome da Vacina"
              value={vacinaSelecionada.Nome_Vacina}
              onChangeText={(text) =>
                setVacinaSelecionada({
                  ...vacinaSelecionada,
                  Nome_Vacina: text,
                })
              }
            />

            {/* Local de Vacinação */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Local de Vacinação"
              value={vacinaSelecionada.Local_Vacinacao}
              onChangeText={(text) =>
                setVacinaSelecionada({
                  ...vacinaSelecionada,
                  Local_Vacinacao: text,
                })
              }
            />

            {/* Data de Vacinação */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Data de Vacinação"
              value={vacinaSelecionada.Data_Vacinacao}
              onChangeText={(text) =>
                setVacinaSelecionada({
                  ...vacinaSelecionada,
                  Data_Vacinacao: text,
                })
              }
            />

            {/* Dose */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Dose"
              keyboardType="numeric"
              value={
                vacinaSelecionada.Dose ? vacinaSelecionada.Dose.toString() : ""
              }
              onChangeText={(text) =>
                setVacinaSelecionada({ ...vacinaSelecionada, Dose: text })
              }
            />
            <View className="flex flex-row justify-between mt-5 w-11/12">
              <TouchableOpacity
                className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
                onPress={() =>
                  editarVacina(
                    Number(vacinaSelecionada.id_vacina),
                    vacinaSelecionada.Nome_Vacina,
                    vacinaSelecionada.Local_Vacinacao,
                    vacinaSelecionada.Data_Vacinacao,
                    Number(vacinaSelecionada.Dose)
                  )
                }
              >
                <Text className="text-white text-sm font-bold">Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#d25a5a]"
                onPress={() => setIsEditarModalVisible(false)}
              >
                <Text className="text-white text-sm font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      {vacinas.length === 0 ? (
        <View className="mt-[10%]">
          <Text className="ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
            Você ainda não possui nenhuma{"\n"} vacina cadastrada.
          </Text>
          <Text className="mt-2 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
            Para adicionar uma nova, clique no botão{" "}
            <Text className="text-lg text-[#1F9A55] font-semibold">Abaixo</Text>{" "}
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
        </View>
      ) : (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            Lista de Vacinas
          </Text>
          <FlatList
            data={vacinas}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
}
