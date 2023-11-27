import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, TextInput } from "react-native";
import DependenteController from "../../Controller/DependenteController";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text'
import { usuarioSessao } from "./LoginScreen";
import * as Notifications from "expo-notifications";
import proximaVacinaController from "../../Controller/proximaVacinaController";


export function Dependentes({ navigation }){
    const [dependentes, setDependentes] = useState([]);
    const [informacoesDependentes, setInformacoesDependentes] = useState([]);

    const [nomeDependente, setnomeDependente] = useState('');
    const [dataNascimento, setdataNascimento] = useState('');
    const [sexo, setSexo] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditarModalVisible, setIsEditarModalVisible] = useState(false);
    const [isProxVacModalVisible, setIsProxVacModalVisible] = useState(false);

    const [dependenteSelecionado, setDependenteSelecionado] = useState(null);
    
    useEffect(() =>{
        buscarDependentes()
        proximaVacina();
        proximasVacinastoModal();
    }, [])

    const openProxModal = () =>{
        setIsProxVacModalVisible(!isProxVacModalVisible);
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const openEditarModal = (id_dependente, Nome_Dependente, Data_Nascimento, Sexo) => {
        console.log("Editar modal")
        setDependenteSelecionado({
            id_dependente,
            Nome_Dependente,
            Data_Nascimento,
            Sexo,
          });
        console.log(dependenteSelecionado)
        setIsEditarModalVisible(true);
        console.log(isEditarModalVisible)
    };

    async function converterFormatoData(input) {
        const partes = input.split('/');
        const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
        console.log("Data convertida:"+dataFormatada)
        return dataFormatada;
    }

    async function buscarDependentes(){
        try{
            const dependentes = await DependenteController.buscarDependentes(usuarioSessao)
            setDependentes(dependentes)
        }catch(error){
            throw error
        }
    }

    async function criarDependente(nomeDependente, dataNascimento, Sexo){
        toggleModal();
        const newData = await converterFormatoData(dataNascimento);
        try{
            const criarDependente = await DependenteController.cadastrarDependentes(usuarioSessao, nomeDependente, newData, Sexo)
            await buscarDependentes()
            await proximaVacina()
            await proximasVacinastoModal()
        }catch(error){
            throw error;
        }
    }

    async function editarDependente(idDependente, nomeDependente, dataNascimento, Sexo){
        setIsEditarModalVisible(false);
        try{
            const editarDependente = await DependenteController.editarDependente(usuarioSessao, idDependente, nomeDependente, dataNascimento, Sexo)
            await buscarDependentes()
            await proximaVacina()
            await proximasVacinastoModal()
        }catch(error){
            throw error;
        }
    }

    async function excluirDependente(idDependente){
        try{
            console.log("Excluindo dependente com id:"+idDependente)
            const excluirDependente = await DependenteController.excluirDependente(usuarioSessao, idDependente)
            await buscarDependentes()
        }catch(error){
            throw error;
        }
    }

    async function proximasVacinastoModal() {
      var informacoesDependentes = [];
    
      try {
        const dependentes = await DependenteController.buscarDependentes(usuarioSessao);
    
        for (const dependente of dependentes) {
          console.log(
            `ID do dependente: ${dependente.id_dependente}| Data de nascimento: ${dependente.Data_Nascimento}| Nome: ${dependente.Nome_Dependente}`
          );
    
          const proximaVacina = await proximaVacinaController.buscarProxVacinas(dependente.id_dependente);
    
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
            console.log("Não há atualizações para o dependente:", dependente.Nome_Dependente);
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

    const renderItem = ({ item }) => (
        <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingBottom: 8 }}>
          <Text>ID do Dependente: {item.id_dependente}</Text>
          <Text>Nome: {item.Nome_Dependente}</Text>
          <Text>Data de nascimento: {item.Data_Nascimento}</Text>
          <Text>Sexo: {item.Sexo}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <TouchableOpacity onPress={() => openEditarModal(item.id_dependente, item.Nome_Dependente, item.Data_Nascimento, item.Sexo)}><Text>Editar</Text></TouchableOpacity>
            <Button title="Excluir" onPress={() => excluirDependente(item.id_dependente)}/>
          </View>
        </View>
    );

    return(
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
                <Text className="font-bold text-2xl text-[#28282D]">Dependentes</Text>
                <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
                <Text className="font-bold text-xs text-[#1F9A55]" onPress={() => openProxModal()}>Proximas</Text>
                <Text className="font-bold text-xs text-[#1F9A55]" onPress={() => navigation.goBack()}>Voltar</Text>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Detalhes do Dependente</Text>
            
                  {/* Nome do dependente */}
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                    placeholder="Nome do dependente" value={nomeDependente} onChangeText={setnomeDependente}
                  />
    
    
                  {/* Data de Nascimento */}
                    <TextInputMask
                        style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                        placeholder="Data de nascimento"
                        value={dataNascimento}
                        type={'datetime'}
                        options={{
                          format: 'DD/MM/YYYY'
                        }}
                        onChangeText={setdataNascimento}
                      />
    
                  {/* Sexo */}
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                    placeholder="Sexo" value={sexo} onChangeText={setSexo}
                  />
    
                  {/* Botão de Criar */}
                  <Button title="Criar Dependente" onPress={() => criarDependente(nomeDependente, dataNascimento, sexo)}/>
            
                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10 }} />
            
                  {/* Botão de Cancelar */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button title="Cancelar" onPress={toggleModal} />
                  </View>
                </View>
            </Modal>
            <Modal isVisible={isEditarModalVisible}>
                {dependenteSelecionado && (
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Detalhes do dependente</Text>
              
                    <TextInput
                      placeholder="ID do dependente"
                      editable={false}
                      value={dependenteSelecionado.id_dependente ? dependenteSelecionado.id_dependente.toString() : ''}
                      onChangeText={(text) => setDependenteSelecionado({ ...dependenteSelecionado, id_dependente: text })}
                      />
  
                    {/* Nome do dependente */}
                    <TextInput
                      placeholder="Nome do dependente"
                      value={dependenteSelecionado.Nome_Dependente}
                      onChangeText={(text) => setDependenteSelecionado({ ...dependenteSelecionado, Nome_Dependente: text })}
                      />
      
      
                    {/* Data de nascimento */}
                      <TextInput
                          style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                          placeholder="Data de nascimento"
                          value={dependenteSelecionado.Data_Nascimento}
                           onChangeText={(text) => setDependenteSelecionado({ ...dependenteSelecionado, Data_Nascimento: text })}
                        />
      
                    <TextInput
                      placeholder="Sexo"
                      value={dependenteSelecionado.Sexo}
                      onChangeText={(text) => setDependenteSelecionado({ ...dependenteSelecionado, Sexo: text })}
                      />
                  </View>
                )}
                    <Button title="Salvar" onPress={() => editarDependente(Number(dependenteSelecionado.id_dependente), dependenteSelecionado.Nome_Dependente, dependenteSelecionado.Data_Nascimento, dependenteSelecionado.Sexo)} />
                    <Button title="Cancelar" onPress={() => setIsEditarModalVisible(false)} />
            </Modal>
            <Modal isVisible={isProxVacModalVisible}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Próximas vacinas</Text>
                    {informacoesDependentes.map((info, index) => (
                        <View key={index}>
                        <Text>Nome:{info.Nome_Dependente}</Text>
                        <Text>Vacina:{info.Nome_Vacina}</Text>
                        <Text>Dose:{info.Dose}</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 10 }}></View>
                        </View>
                    ))}
                    <Button title="Fechar" onPress={() => openProxModal()} />
                </View>
            </Modal>
            {dependentes.length === 0 ? (
                <View><Text>Não há dependentes cadastrados</Text></View>
            ):(
                <View style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Lista de dependentes</Text>
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