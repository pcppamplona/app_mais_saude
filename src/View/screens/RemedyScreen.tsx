import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import Remedio from "../components/remedio";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";

import { usuarioSessao } from "./LoginScreen";
import RemedioController from "../../Controller/RemedioController";
import * as Notifications from "expo-notifications";
import ModalRemedio from "react-native-modal";
import FormNewRemedio from "../components/FormNewRemedio";
import FormEditRemedio from "../components/FormEditRemedio";

export function RemedyScreen({ navigation }) {
  const [remedios, setRemedios] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditRemedio, setIsModalEditRemedio] = useState(false);
  const [idRemedioEditing, setIdRemedioEditing] = useState();
  const [criarRemedios, setCriarRemedios] = useState([]);
  const [expandedRemedio, setExpandedRemedio] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
  };

  const handleRemedioPress = (id_remedio) => {
    setExpandedRemedio(id_remedio === expandedRemedio ? null : id_remedio);
  };

  const updateRemediosList = async () => {
    try {
      const id_usuario = usuarioSessao;
      const data = await RemedioController.BuscarRemedios(id_usuario);
      setRemedios(data);
    } catch (error) {
      console.error("Erro ao buscar remédios:", error);
    }
  };

  const addRemedio = async (novoRemedio) => {
    try {
      setCriarRemedios([...criarRemedios, novoRemedio]);
      const { nomeRemedio, horarioInicial, quantidadeDias, frequencia } =
        novoRemedio;
      const id_usuario = usuarioSessao;

      const CriarRemedio = await RemedioController.CriarRemedio(
        id_usuario,
        nomeRemedio,
        horarioInicial,
        quantidadeDias,
        frequencia
      );

      const BuscarUltimoRemedio = await RemedioController.BuscarUltimoRemedio();

      if (BuscarUltimoRemedio) {
        const {
          id_remedio,
          Nome_Remedio,
          Horario_Inicial,
          Frequencia,
          Qntd_Total,
        } = BuscarUltimoRemedio;
        await agendarNotificacoes(
          id_remedio,
          Nome_Remedio,
          Horario_Inicial,
          Frequencia,
          Qntd_Total
        );
      } else {
        console.error("Nenhum remédio encontrado.");
      }

      await updateRemediosList();
    } catch (error) {
      console.error("Erro ao criar remédio:", error);
    }
  };

  const editRemedio = async (editedRemedio) => {
    try {
      await updateRemediosList();
    } catch (error) {
      console.error("Erro ao editar remédio:", error);
    }
  };

  useEffect(() => {
    const id_usuario = usuarioSessao;
    async function limparNotificacoesAgendadas() {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    limparNotificacoesAgendadas();

    RemedioController.BuscarRemedios(id_usuario)
      .then((data) => {
        setRemedios(data);
        console.log("Remedios:", data);
      })
      .catch((error) => {
        console.error("Erro ao buscar remédios:", error);
      });
  }, []);

  useEffect(() => {
    // Agendar ou cancelar notificações conforme necessário
    // agendarNotificacoes("Novo Remédio", "16:43:00", "00:00:30", 3);
    // Notifications.cancelAllScheduledNotificationsAsync();
  });

  useEffect(() => {
    const novaNotificacao = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log("Nova notificação!");
        const idNotificacao = notification.request.content.data.id;
        const nomeNotificacao = notification.request.content.data.nome;
        const frequenciaNotificacao =
          notification.request.content.data.frequencia;
        let totalDosesNotificacao =
          notification.request.content.data.qntdTotalDoses;
        console.log(
          "Dados da notificação:" +
            "id:" +
            idNotificacao +
            "| Nome:" +
            nomeNotificacao +
            "| Frequencia:" +
            frequenciaNotificacao +
            "| Quantidade total de doses:" +
            totalDosesNotificacao
        );
        try {
          if (totalDosesNotificacao > 0) {
            totalDosesNotificacao = totalDosesNotificacao - 1;
            console.log("totalDosesNotificacao:" + totalDosesNotificacao);
            await RemedioController.atualizarQntdDosesRestantes(
              idNotificacao,
              1
            );
            await agendarDemaisNotificacoes(
              idNotificacao,
              nomeNotificacao,
              frequenciaNotificacao,
              totalDosesNotificacao
            );
            try {
              await updateRemediosList();
            } catch (error) {
              throw error;
            }
          } else {
            console.log("FIM das notificações desse remédio");
            return;
          }
        } catch (error) {
          throw error;
        }
      }
    );
  }, []);

  async function agendarNotificacoes(
    idRemedio,
    nomeRemedio,
    horarioInicial,
    frequencia,
    qntdTotalDoses,
    isEdited?
  ) {
    if (isEdited == true) {
      console.log("isEdited é true");
      var newqntdTotalDoses = 3;
      qntdTotalDoses = newqntdTotalDoses;
    } else {
      qntdTotalDoses = qntdTotalDoses;
      console.log("Total doses novo:" + qntdTotalDoses);
    }

    const agora = new Date();
    const partesHorario = horarioInicial.split(":");
    const horasInicial = parseInt(partesHorario[0]);
    const minutosInicial = parseInt(partesHorario[1]);
    const segundosInicial = parseInt(partesHorario[2]);

    const horaInicial = new Date();
    horaInicial.setHours(horasInicial, minutosInicial, segundosInicial);

    const diferencaEmMilissegundos = horaInicial.getTime() - agora.getTime();
    const diferencaEmSegundos = diferencaEmMilissegundos / 1000;

    //convertendo frequencia

    const partesFrequencia = frequencia.split(":");
    const horas = parseInt(partesFrequencia[0]);
    const minutos = parseInt(partesFrequencia[1]);
    const segundos = parseInt(partesFrequencia[2]);

    const frequenciaFinal = horas * 3600 + minutos * 60 + segundos;

    console.log("Diferença em segundos:" + diferencaEmSegundos);
    console.log("Frequencia em segundos:" + frequenciaFinal);

    const trigger = new Date(Date.now());
    trigger.setSeconds(trigger.getSeconds() + diferencaEmSegundos);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Medicamento",
        body: `Hora de tomar ${nomeRemedio}`,
        data: {
          id: idRemedio,
          nome: nomeRemedio,
          frequencia: frequenciaFinal,
          qntdTotalDoses: qntdTotalDoses,
        },
      },
      trigger,
      identifier: idRemedio.toString(),
    });
  }

  async function agendarDemaisNotificacoes(
    idRemedio,
    nomeRemedio,
    frequenciaFinal,
    qntdTotalDoses
  ) {
    const trigger = new Date(Date.now());
    trigger.setSeconds(trigger.getSeconds() + frequenciaFinal);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Medicamento",
        body: `Hora de tomar ${nomeRemedio}`,
        data: {
          id: idRemedio,
          nome: nomeRemedio,
          frequencia: frequenciaFinal,
          qntdTotalDoses: qntdTotalDoses,
        },
      },
      trigger,
      identifier: idRemedio.toString(),
    });
  }

  async function editarNotificacao(
    idRemedio: number,
    novoNome: string,
    novoHorario: string,
    novaqntdDias: number,
    novaFrequencia: string
  ) {
    const isEdited = true;
    console.log("Editando agendamento");
    await Notifications.cancelScheduledNotificationAsync(idRemedio.toString());
    await agendarNotificacoes(
      idRemedio,
      novoNome,
      novoHorario,
      novaFrequencia,
      novaqntdDias,
      isEdited
    );
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleModalEdit = () => {
    setIsModalEditRemedio(!isModalEditRemedio);
  };

  const handleEditarRemedio = (idRemedio) => {
    console.log(`Editar remédio com ID ${idRemedio}`);
    setIdRemedioEditing(idRemedio);
    setIsModalEditRemedio(true);
  };

  const handleExcluirRemedio = async (idRemedio) => {
    console.log(`Excluir remédio com ID ${idRemedio}`);
    try {
      const id_usuario = usuarioSessao;
      RemedioController.excluirRemedio(id_usuario, idRemedio);
      Notifications.cancelScheduledNotificationAsync(idRemedio.toString());
      await updateRemediosList();
    } catch (error) {
      console.log("Erro ao excluir remédio");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => closeSearchBar()}>
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
          <Icon name="plus" size={22} color="white" />
        </TouchableOpacity>

        <ModalRemedio isVisible={isModalVisible}>
          <FormNewRemedio
            isVisible={isModalVisible}
            closeModal={() => toggleModal()}
            addRemedio={addRemedio}
          />
        </ModalRemedio>

        <ModalRemedio isVisible={isModalEditRemedio}>
          <FormEditRemedio
            isVisible={isModalEditRemedio}
            closeModal={() => toggleModalEdit()}
            editedRemedio={editRemedio}
            id_remedio={idRemedioEditing}
            editarNotificacao={editarNotificacao}
          />
        </ModalRemedio>

        {remedios.length === 0 ? (
          <View>
            <View className="flex flex-row w-full justify-between items-center mr-auto py-8 px-4">
              <Text className="font-bold text-2xl text-[#28282D]">
                Medicamentos
              </Text>
              <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
            </View>
            <Image
              source={require("../../../assets/backgrounds/fundoRemedyComplete.png")}
              className="w-full h-auto top-[5%] bottom-0 animate-pulse"
            />
            <Text className="mt-10 ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
              Você ainda não possui nenhum{"\n"} medicamento cadastrado.
            </Text>
            <Text className="mt-14 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
              Para adicionar um novo, clique no botão{" "}
              <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>{" "}
              abaixo e{"\n"} digite o nome do medicamento desejado..
            </Text>
          </View>
        ) : (
          <>
            <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto pt-8">
              <Text className="font-bold text-2xl text-[#28282D]">
                Medicamentos
              </Text>
              <TouchableOpacity onPress={() => toggleSearchBar()} className="">
                <Icon name="filter" size={15} color="#2BB459" />
              </TouchableOpacity>
            </View>

            {/* Barra de pesquisa (condicional) */}
            {isSearchBarVisible && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 16,
                  marginTop: 8,
                }}
              >
                <TextInput
                  className="flex-1 border-[1px] border-[#ccc] rounded-lg px-2"
                  placeholder="Pesquisar medicamento..."
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => closeSearchBar()}
                >
                  <Icon name="times" size={20} color="#2BB459" />
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              className="mt-4 mx-4"
              data={remedios.filter((remedio) =>
                remedio.Nome_Remedio.toLowerCase().includes(
                  searchText.toLowerCase()
                )
              )}
              keyExtractor={(item) => item.id_remedio.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRemedioPress(item.id_remedio)}
                >
                  <Remedio
                    Nome_Remedio={item.Nome_Remedio}
                    Quantidade_Dias={item.Quantidade_Dias}
                    Frequencia={item.Frequencia}
                    Doses_Atrasadas={item.Doses_Atrasadas}
                    Qntd_DosesRestantes={item.Qntd_DosesRestantes}
                    Status={item.Status}
                    onEditarPress={() => handleEditarRemedio(item.id_remedio)}
                    onExcluirPress={() => handleExcluirRemedio(item.id_remedio)}
                    expanded={item.id_remedio === expandedRemedio}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
