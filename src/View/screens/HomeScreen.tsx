import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import proximaVacinaController from "../../Controller/proximaVacinaController";
import DependenteController from "../../Controller/DependenteController";
import * as Notifications from "expo-notifications";
import { usuarioSessao } from "./LoginScreen";
import UsuarioController from "../../Controller/UsuarioController";
import Icon from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export function HomeScreen({ navigation }) {
  useEffect(() => {
    proximaVacina();
  }, []);

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

  const carouselImages = [
    require("../../../assets/backgrounds/banner1.jpg"),
    require("../../../assets/backgrounds/banner2.png"),
    require("../../../assets/backgrounds/banner3.png"),
  ];

  // Estado para controlar o índice da imagem atual no carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estado para controlar a animação de deslize
  const slideAnimation = new Animated.Value(0);

  const windowWidth = Dimensions.get("window").width;

  // Função para avançar para a próxima imagem no carousel
  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Função para retroceder para a imagem anterior no carousel
  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  // Efeito para mudar automaticamente os slides a cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      showNextImage();
    }, 4000);

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [currentImageIndex]); // Reagir apenas a mudanças em currentImageIndex

  // Efeito para animar o deslize quando a imagem muda
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: -currentImageIndex * windowWidth,
      duration: 1000, // Duração da transição em milissegundos
      useNativeDriver: false,
    }).start();
  }, [currentImageIndex]); // Reagir apenas a mudanças em currentImageIndex

  // Função para obter o estilo de deslize baseado no índice da imagem
  const getImageStyle = () => {
    return {
      transform: [{ translateX: slideAnimation }],
    };
  };

  const HealthInfoCard = ({ icon, label, value }) => (
    <View className="bg-[#F3F3F3] p-4 ml-4 w-40 mt-1 h-32 rounded-lg">
      <MaterialCommunityIcons name={icon} size={30} color="#1F9A55" />
      <Text className="text-sm font-bold text-[#5AD276] mt-2">{label}</Text>
      <Text className="text-xs">{value}</Text>
    </View>
  );

  const [selectedTip, setSelectedTip] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleWellnessTipPress = (tip) => {
    setSelectedTip(tip);
    toggleModal();
  };

  return (
    <View className="flex-1 bg-[#fff]">
      <View className="flex flex-row items-center ml-4 mr-auto mt-10 mb-2">
        <Text className="font-normal text-xl text-[#28282D]">Olá, </Text>

        <Text className="font-bold text-xl text-[#28282D]">{name}</Text>
        <View className="flex-1 flex-row justify-end">
          <TouchableOpacity>
            <FontAwesome
              name="bell"
              size={22}
              color="#9e9ea0"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[1px] w-11/12 ml-auto mr-auto bg-[#EAEAEA]" />

      {/* Carousel */}
      <View className="mt-3 overflow-hidden">
        <Animated.View
          style={{
            flexDirection: "row",
            width: windowWidth * carouselImages.length,
            transform: [{ translateX: slideAnimation }],
          }}
        >
          {carouselImages.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={{ width: windowWidth, height: 200, borderRadius: 4 }}
            />
          ))}
        </Animated.View>
        <View className="flex flex-row justify-center ">
          <View className="flex flex-row justify-center mt-2 mb-1">
            {carouselImages.map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 rounded"
                style={{
                  backgroundColor:
                    index === currentImageIndex ? "#5AD276" : "#9e9ea0",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <View className="h-[1px] w-11/12 ml-auto mr-auto bg-[#EAEAEA]" />

      <View className="ml-4">
        <Text className="text-black text-lg font-bold mt-2">Opções</Text>
      </View>
      <View className="flex flex-row w-full justify-between items-center px-4 py-2 overflow-x-auto">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("HealthCenter");
          }}
          className="w-16 h-16 flex justify-center items-center rounded-lg bg-[#f3f3f3]"
        >
          <MaterialIcons name="local-hospital" size={32} color="#5AD276" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Vacinas");
          }}
          className="w-16 h-16 flex justify-center items-center rounded-lg bg-[#f3f3f3]"
        >
          <FontAwesome5 name="syringe" size={26} color="#5AD276" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Remédios");
          }}
          className="w-16 h-16 flex justify-center items-center rounded-lg bg-[#f3f3f3]"
        >
          <MaterialCommunityIcons name="pill" size={30} color="#5AD276" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Calendar");
          }}
          className="w-16 h-16 flex justify-center items-center rounded-lg bg-[#f3f3f3]"
        >
          <MaterialCommunityIcons name="calendar" size={30} color="#5AD276" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings");
          }}
          className="w-16 h-16 flex justify-center items-center rounded-lg bg-[#f3f3f3]"
        >
          <Icon name="player-settings" size={25} color="#5AD276" />
        </TouchableOpacity>
      </View>

      <View className="h-[1px] w-11/12 ml-auto mt-1 mr-auto bg-[#EAEAEA]" />

      <Text className="text-base font-bold text-[#2BB459] mt-2 mx-4">
        Dicas de Saúde Atuais
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <HealthInfoCard
            icon="food-apple"
            label="Nutrição"
            value="Consuma frutas e vegetais diariamente."
          />
          <HealthInfoCard
            icon="cup"
            label="Hidratação"
            value="Consuma 35 ml por kg corporal por dia."
          />
          <HealthInfoCard
            icon="eye"
            label="Visão"
            value="Não fique mais de 4 horas seguidas olhando telas."
          />
          <HealthInfoCard
            icon="weight-lifter"
            label="Corpo"
            value="Se exercite ao mínimo 1 hora por dia."
          />
        </View>
      </ScrollView>
    </View>
  );
}
