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
import DependenteController from "../../Controller/DependenteController";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconArrow from "react-native-vector-icons/Fontisto";
import Modal from "react-native-modal";
import { TextInputMask } from "react-native-masked-text";
import { usuarioSessao } from "./LoginScreen";
import * as Notifications from "expo-notifications";
import proximaVacinaController from "../../Controller/proximaVacinaController";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";
import DeleteIcon from "react-native-vector-icons/Fontisto";
import EditIcon from "react-native-vector-icons/FontAwesome5";

export function Dependentes({ navigation }) {
  const [dependentes, setDependentes] = useState([]);
  const [informacoesDependentes, setInformacoesDependentes] = useState([]);

  const [nomeDependente, setnomeDependente] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const [sexo, setSexo] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditarModalVisible, setIsEditarModalVisible] = useState(false);
  const [isProxVacModalVisible, setIsProxVacModalVisible] = useState(false);

  const [dependenteSelecionado, setDependenteSelecionado] = useState(null);

  // State para verificar se existe algum card expandido
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    buscarDependentes();
    proximaVacina();
    proximasVacinastoModal();
  }, []);

  const openProxModal = () => {
    setIsProxVacModalVisible(!isProxVacModalVisible);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openEditarModal = (
    id_dependente,
    Nome_Dependente,
    Data_Nascimento,
    Sexo
  ) => {
    console.log("Editar modal");
    setDependenteSelecionado({
      id_dependente,
      Nome_Dependente,
      Data_Nascimento,
      Sexo,
    });
    console.log(dependenteSelecionado);
    setIsEditarModalVisible(true);
    console.log(isEditarModalVisible);
  };

  async function converterFormatoData(input) {
    const partes = input.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    console.log("Data convertida:" + dataFormatada);
    return dataFormatada;
  }

  async function buscarDependentes() {
    try {
      const dependentes = await DependenteController.buscarDependentes(
        usuarioSessao
      );
      setDependentes(dependentes);
    } catch (error) {
      throw error;
    }
  }

  async function criarDependente(nomeDependente, dataNascimento, Sexo) {
    toggleModal();
    const newData = await converterFormatoData(dataNascimento);
    try {
      const criarDependente = await DependenteController.cadastrarDependentes(
        usuarioSessao,
        nomeDependente,
        newData,
        Sexo
      );
      await buscarDependentes();
      await proximaVacina();
      await proximasVacinastoModal();
    } catch (error) {
      throw error;
    }
  }

  async function editarDependente(
    idDependente,
    nomeDependente,
    dataNascimento,
    Sexo
  ) {
    setIsEditarModalVisible(false);
    try {
      const editarDependente = await DependenteController.editarDependente(
        usuarioSessao,
        idDependente,
        nomeDependente,
        dataNascimento,
        Sexo
      );
      await buscarDependentes();
      await proximaVacina();
      await proximasVacinastoModal();
    } catch (error) {
      throw error;
    }
  }

  async function excluirDependente(idDependente) {
    try {
      console.log("Excluindo dependente com id:" + idDependente);
      const excluirDependente = await DependenteController.excluirDependente(
        usuarioSessao,
        idDependente
      );
      await buscarDependentes();
    } catch (error) {
      throw error;
    }
  }

  async function proximasVacinastoModal() {
    var informacoesDependentes = [];

    try {
      const dependentes = await DependenteController.buscarDependentes(
        usuarioSessao
      );

      for (const dependente of dependentes) {
        console.log(
          `ID do dependente: ${dependente.id_dependente}| Data de nascimento: ${dependente.Data_Nascimento}| Nome: ${dependente.Nome_Dependente}`
        );

        const proximaVacina = await proximaVacinaController.buscarProxVacinas(
          dependente.id_dependente
        );

        console.log("Proxima vacina:" + JSON.stringify(proximaVacina));

        if (proximaVacina && proximaVacina.length > 0) {
          console.log("Dependente atualizado:");

          // Adicionar informações do dependente ao array
          informacoesDependentes.push({
            Nome_Dependente: dependente.Nome_Dependente,
            Nome_Vacina: proximaVacina[0].Nome_Vacina,
            Dose: proximaVacina[0].Dose,
          });
        } else {
          console.log(
            "Não há atualizações para o dependente:",
            dependente.Nome_Dependente
          );
        }
      }

      console.log("Informações dos dependentes:", informacoesDependentes);

      // Aqui você pode utilizar a variável informacoesDependentes para exibir no modal ou realizar outras operações necessárias
      setInformacoesDependentes(informacoesDependentes);
    } catch (error) {
      throw error;
    }
  }

  async function proximaVacina() {
    let dependentesAtualizados = 0;
    let informacoesDependentes = [];

    try {
      const dependentes = await DependenteController.buscarDependentes(
        usuarioSessao
      );

      for (const dependente of dependentes) {
        console.log(
          `ID do dependente: ${dependente.id_dependente}| Data de nascimento: ${dependente.Data_Nascimento}| Nome: ${dependente.Nome_Dependente}`
        );

        const dependentesProximaVacina =
          await proximaVacinaController.verificacaoProxVacina(
            dependente.id_dependente,
            dependente.Data_Nascimento
          );

        console.log(dependentesProximaVacina);

        if (dependentesProximaVacina === false) {
          console.log("Não há atualizações de próximas vacinas!");
        } else {
          dependentesAtualizados += 1;
          console.log("Dependentes atualizados: " + dependentesAtualizados);

          // Adicionar informações do dependente ao array
          informacoesDependentes.push({
            id_dependente: dependente.id_dependente,
            Nome_Dependente: dependente.Nome_Dependente,
            proximasVacinas: await proximaVacinaController.buscarProxVacinas(
              dependente.id_dependente
            ),
          });
        }
      }
      console.log("Dependentes atualizados: " + dependentesAtualizados);
      let notificacoesDependentes = [];
      if (dependentesAtualizados > 0) {
        informacoesDependentes.forEach((dependenteInfo) => {
          const { Nome_Dependente, proximasVacinas } = dependenteInfo;

          let notificacao = `${Nome_Dependente}:\n`;

          proximasVacinas.forEach((proximaVacina) => {
            notificacao += `Vacina: ${proximaVacina.Nome_Vacina}\n`;
            notificacao += `Dose: ${proximaVacina.Dose}\n\n`;
          });

          notificacoesDependentes.push(notificacao);
        });
        agendarNotificacao(notificacoesDependentes);
      } else {
        console.log("Não há atualizações de nenhum dependente");
      }
    } catch (error) {
      throw error;
    }
  }

  async function agendarNotificacao(notificacoesDependentes) {
    const trigger = new Date(Date.now());
    trigger.setSeconds(trigger.getSeconds() + 2);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Próximas doses",
        body: `${notificacoesDependentes}`,
      },
      trigger,
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

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
                source={require("../../../assets/illustrations/hospital.png")}
                className="w-10 h-10"
              />
            </View>
          </View>

          <View className="flex">
            <View className="flex flex-row items-center">
              <Text className="text-base font-bold">Nome - </Text>
              <Text className="text-base font-bold">{item.Nome_Dependente}</Text>
            </View>
            <View className="flex flex-row items-center mt-4">
              <Text className="text-xs font-semibold">Código dependente: </Text>
              <Text className="text-xs font-medium">{item.id_dependente}</Text>
            </View>
            <View className="flex flex-row items-center mt-1">
              <Text className="text-xs font-semibold">Nascimento: </Text>
              <Text className="text-xs font-medium">{item.Data_Nascimento}</Text>
            </View>

            <View className="flex flex-row items-center mt-1">
              <Text className="text-xs font-semibold">Sexo: </Text>
              <Text className="text-xs font-medium">{item.Sexo}</Text>
            </View>
          </View>
        </View>

        {expandedItem === item.ID && (
          <>
            <View className="flex flex-row justify-start mt-6">
              <TouchableOpacity
                className="flex-row items-center p-2 bg-green-500 rounded-md"
                onPress={() =>
                  openEditarModal(
                    item.id_dependente,
                    item.Nome_Dependente,
                    item.Data_Nascimento,
                    item.Sexo
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
                onPress={() => excluirDependente(item.id_dependente)}
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
        <Icon name="person-add-alt-1" size={22} color="white" />
      </TouchableOpacity>

      <View className="flex flex-row w-full justify-between items-center mr-auto py-8 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconArrow name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#28282D] ml-6 ">
          Dependentes
        </Text>
        <Text
          className="font-bold text-xs text-[#1F9A55]"
          onPress={() => openProxModal()}
        >
          Proximas
        </Text>
      </View>

      <Modal isVisible={isModalVisible}>
        <View className="flex flex-col bg-white p-5 h-500 m-7 justify-center items-center rounded-xl">
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Informações do Dependente
          </Text>

          {/* Nome do dependente */}
          <TextInput
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-4"
            placeholder="Nome do dependente"
            value={nomeDependente}
            onChangeText={setnomeDependente}
          />

          {/* Data de Nascimento */}
          <TextInputMask
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
            placeholder="Data de nascimento"
            value={dataNascimento}
            type={"datetime"}
            options={{
              format: "DD/MM/YYYY",
            }}
            onChangeText={setdataNascimento}
          />

          {/* Sexo */}
          <TextInput
            className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
            placeholder="Sexo"
            value={sexo}
            onChangeText={setSexo}
          />

          <View className="flex flex-row justify-between mt-5 w-11/12">
            <TouchableOpacity
              className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
              onPress={() =>
                criarDependente(nomeDependente, dataNascimento, sexo)
              }
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
        {dependenteSelecionado && (
          <View className="flex flex-col bg-white p-5 h-700 m-7 justify-center items-center rounded-xl">
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Editar Informações - Dependente
            </Text>

            {/* Nome do dependente */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Nome do dependente"
              value={dependenteSelecionado.Nome_Dependente}
              onChangeText={(text) =>
                setDependenteSelecionado({
                  ...dependenteSelecionado,
                  Nome_Dependente: text,
                })
              }
            />

            {/* Data de nascimento */}
            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Data de nascimento"
              value={dependenteSelecionado.Data_Nascimento}
              onChangeText={(text) =>
                setDependenteSelecionado({
                  ...dependenteSelecionado,
                  Data_Nascimento: text,
                })
              }
            />

            <TextInput
              className="flex border-[1px] border-[#bebebf] p-2 w-11/12 rounded-lg mt-2"
              placeholder="Sexo"
              value={dependenteSelecionado.Sexo}
              onChangeText={(text) =>
                setDependenteSelecionado({
                  ...dependenteSelecionado,
                  Sexo: text,
                })
              }
            />

            <View className="flex flex-row justify-between mt-5 w-11/12">
              <TouchableOpacity
                className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#5AD276]"
                onPress={() =>
                  editarDependente(
                    Number(dependenteSelecionado.id_dependente),
                    dependenteSelecionado.Nome_Dependente,
                    dependenteSelecionado.Data_Nascimento,
                    dependenteSelecionado.Sexo
                  )
                }
              >
                <Text className="text-white text-sm font-bold">Salvar</Text>
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
      <Modal isVisible={isProxVacModalVisible}>
        <View className="flex flex-col bg-white p-5 h-800 m-7 justify-center items-center rounded-xl">
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Próxima da Vacina
          </Text>
          {informacoesDependentes.map((info, index) => (
            <View key={index}>
              <View className="flex flex-row items-center">
                <Text className="text-sm font-semibold">Paciente -  </Text>
                <Text>{info.Nome_Dependente}</Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-sm font-semibold">Vacina -  </Text>
                <Text>{info.Nome_Vacina}</Text>
              </View><View className="flex flex-row items-center">
                <Text className="text-sm font-semibold">Dose -  </Text>
                <Text>{info.Dose}</Text>
              </View>
            
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "gray",
                  marginBottom: 20,
                  marginTop: 20,
                }}
              ></View>
            </View>
          ))}
          <TouchableOpacity
              className="w-[96px] rounded-md flex flex-row justify-center p-2 bg-[#d25a5a]"
              onPress={() => openProxModal()}
            >
              <Text className="text-white text-sm font-bold">Cancelar</Text>
            </TouchableOpacity>
          {/* <Button title="Fechar" onPress={() => openProxModal()} /> */}
        </View>
      </Modal>
      {dependentes.length === 0 ? (
        <View>
          <Text className="mt-10 ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
            Você ainda não possui nenhum{"\n"} dependente cadastrado.
          </Text>
          <Image
            source={require("../../../assets/backgrounds/fundoDependenteTela.png")}
            className="w-full h-auto top-[5%] bottom-0 animate-pulse"
          />

          <Text className="mt-14 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
            Para adicionar um novo, clique no botão{" "}
            <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>{" "}
            abaixo e{"\n"} digite as demais informações..
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            Lista de dependentes
          </Text>
          <FlatList
            data={dependentes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
}
