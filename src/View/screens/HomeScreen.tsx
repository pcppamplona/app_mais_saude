import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native"; 
import { usuarioSessao } from './LoginScreen';
import proximaVacinaController from "../../Controller/proximaVacinaController";
import DependenteController from "../../Controller/DependenteController";
import * as Notifications from "expo-notifications";

export function HomeScreen() {
  // const route = useRoute();
  // const { usuarioId } = route.params as { usuarioId: number | null };
  useEffect(() => {
    proximaVacina()
  }, [])


  async function proximaVacina() {
    let dependentesAtualizados = 0;
    let informacoesDependentes = [];
  
    try {
      const dependentes = await DependenteController.buscarDependentes(usuarioSessao);
  
      for (const dependente of dependentes) {
        console.log(`ID do dependente: ${dependente.id_dependente}| Data de nascimento: ${dependente.Data_Nascimento}| Nome: ${dependente.Nome_Dependente}`);
        
        const dependentesProximaVacina = await proximaVacinaController.verificacaoProxVacina(dependente.id_dependente, dependente.Data_Nascimento);
        
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
            proximasVacinas: await proximaVacinaController.buscarProxVacinas(dependente.id_dependente),
          });
        }
      }
      console.log("Dependentes atualizados: " + dependentesAtualizados);
      let notificacoesDependentes = [];
      if(dependentesAtualizados > 0){
        informacoesDependentes.forEach((dependenteInfo) => {
          const { Nome_Dependente, proximasVacinas } = dependenteInfo;
      
          let notificacao = `${Nome_Dependente}:\n`;
      
          proximasVacinas.forEach((proximaVacina) => {
            notificacao += `Vacina: ${proximaVacina.Nome_Vacina}\n`;
            notificacao += `Dose: ${proximaVacina.Dose}\n\n`;
          });
      
          notificacoesDependentes.push(notificacao);
        });
        agendarNotificacao(notificacoesDependentes)
      }else{
        console.log("Não há atualizações de nenhum dependente");
      }
    } catch (error) {
      throw error;
    }
  }

  async function agendarNotificacao(notificacoesDependentes){
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
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-red-700">Home</Text>
      <Text>ID do Usuário: {usuarioSessao}</Text>
    </View>
  );
}
