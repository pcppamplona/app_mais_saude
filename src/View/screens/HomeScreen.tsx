import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import proximaVacinaController from "../../Controller/proximaVacinaController";
import DependenteController from "../../Controller/DependenteController";
import * as Notifications from "expo-notifications";
import { usuarioSessao } from "./LoginScreen";
import Icon from "react-native-vector-icons/Fontisto";
import Icon2 from "react-native-vector-icons/FontAwesome";
import UsuarioController from "../../Controller/UsuarioController";

export function HomeScreen({ navigation }) {
  // const route = useRoute();
  // const { usuarioId } = route.params as { usuarioId: number | null };
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

  return (
    <View className="flex-1 bg-[#fff]">
      <View className="flex flex-row items-center ml-4 mr-auto mt-10 mb-2">
        <Image
          source={require("../../../assets/logo.png")}
          style={{ width: 32, height: 30 }}
        />
        <Text className="font-normal text-xl text-[#28282D]">Olá, </Text>

        <Text className="font-bold text-xl text-[#28282D]">{name}</Text>
        <View className="flex-1 flex-row justify-end">
          <TouchableOpacity>
            <Icon2
              name="bell"
              size={22}
              color="#9e9ea0"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[2px] w-11/12 ml-auto mr-auto bg-[#EAEAEA]" />
      <Text style={{ color: "red" }}>Home</Text>
      <Text>ID do Usuário: {usuarioSessao}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("HealthCenter pressed!");
          navigation.navigate("HealthCenter");
        }}
      >
        <Text>Posto de saúde</Text>
      </TouchableOpacity>
    </View>
  );
}
