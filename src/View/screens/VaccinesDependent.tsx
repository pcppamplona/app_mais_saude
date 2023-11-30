import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, TextInput } from "react-native";
import vacinaDependenteController from "../../Controller/vacinaDependenteController";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text'


export function VaccinesDependent({ route, navigation }){
    const { id_carteiraDependente } = route.params;
    const [vacinas, setVacinas] = useState([]);

    const [nomeVacina, setNomeVacina] = useState('');
    const [localVacinacao, setlocalVacinacao] = useState('');
    const [dataVacinacao, setdataVacinacao] = useState('');
    const [dose, setDose] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditarModalVisible, setIsEditarModalVisible] = useState(false);

    const [vacinaSelecionada, setVacinaSelecionada] = useState(null);
    
    useEffect(() =>{
        buscarVacinas()
    }, [])

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const openEditarModal = (id_vacinaDependente, Nome_Vacina, Local_Vacinacao, Data_Vacinacao, Dose) => {
        console.log("Editar modal")
        setVacinaSelecionada({
            id_vacinaDependente,
            Nome_Vacina,
            Local_Vacinacao,
            Data_Vacinacao,
            Dose,
          });
        console.log(vacinaSelecionada)
        setIsEditarModalVisible(true);
        console.log(isEditarModalVisible)
    };

    async function converterFormatoData(input) {
        const partes = input.split('/');
        const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
        console.log("Data convertida:"+dataFormatada)
        return dataFormatada;
    }

    async function buscarVacinas(){
        try{
            const vacinasDependente = await vacinaDependenteController.buscarVacinaDependente(id_carteiraDependente);
            setVacinas(vacinasDependente)
        }catch(error){
            throw error
        }
    }

    async function cadastrarVacina(nomeVacina, localVacinacao, dataVacinacao, dose){
        toggleModal();
        const newData = await converterFormatoData(dataVacinacao);
        try{
            const cadastrarVacina = await vacinaDependenteController.cadastrarVacinaDependentes(id_carteiraDependente, nomeVacina, localVacinacao, newData, Number(dose))
            await buscarVacinas()
        }catch(error){
            throw error;
        }
    }

    async function editarVacina(idVacinaDependente, NomeVacina, LocalVacinacao, DataVacinacao, Dose){
        setIsEditarModalVisible(false);
        try{
            const editarVacina = await vacinaDependenteController.editarVacinaDependente(id_carteiraDependente, idVacinaDependente ,NomeVacina, LocalVacinacao, DataVacinacao, Dose)
            await buscarVacinas()
        }catch(error){
            throw error;
        }
    }

    async function excluirVacina(idVacinaDependente){
        try{
            console.log("Excluindo vacina com id:"+idVacinaDependente)
            const excluirVacina = await vacinaDependenteController.excluirVacinaDependente(id_carteiraDependente, idVacinaDependente)
            await buscarVacinas()
        }catch(error){
            throw error;
        }
    }

    const renderItem = ({ item }) => (
        <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingBottom: 8 }}>
          <Text>ID da Vacina: {item.id_vacinaDependente}</Text>
          <Text>Nome da Vacina: {item.Nome_Vacina}</Text>
          <Text>Local da Vacinação: {item.Local_Vacinacao}</Text>
          <Text>Data da Vacinação: {item.Data_Vacinacao}</Text>
          <Text>Dose: {item.Dose}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <TouchableOpacity onPress={() => openEditarModal(item.id_vacinaDependente, item.Nome_Vacina, item.Local_Vacinacao, item.Data_Vacinacao, item.Dose)}><Text>Editar</Text></TouchableOpacity>
            <Button title="Excluir" onPress={() => excluirVacina(item.id_vacinaDependente)}/>
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
                <Text className="font-bold text-2xl text-[#28282D]">Vacinas</Text>
                <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
                <Text className="font-bold text-xs text-[#1F9A55]" onPress={() => navigation.goBack()}>Voltar</Text>
            </View>
            <Text>
                Id da carteira: { id_carteiraDependente }
            </Text>
            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Detalhes da Vacina</Text>
            
                  {/* Nome da Vacina */}
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                    placeholder="Nome da Vacina" value={nomeVacina} onChangeText={setNomeVacina}
                  />
    
                  {/* Local de Vacinação */}
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                    placeholder="Local de Vacinação" value={localVacinacao} onChangeText={setlocalVacinacao}
                  />
    
                  {/* Data de Vacinação */}
                    <TextInputMask
                        style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                        placeholder="Data de Vacinação"
                        value={dataVacinacao}
                        type={'datetime'}
                        options={{
                          format: 'DD/MM/YYYY'
                        }}
                        onChangeText={setdataVacinacao}
                      />
    
                  {/* Dose */}
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                    placeholder="Dose" keyboardType="numeric" value={dose} onChangeText={setDose}
                  />
    
                  {/* Botão de Criar */}
                  <Button title="Criar Vacina" onPress={() => cadastrarVacina(nomeVacina, localVacinacao, dataVacinacao, dose)}/>
            
                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10 }} />
            
                  {/* Botão de Cancelar */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button title="Cancelar" onPress={toggleModal} />
                  </View>
                </View>
            </Modal>
            <Modal isVisible={isEditarModalVisible}>
                {vacinaSelecionada && (
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Detalhes da Vacina</Text>
              
                    <TextInput
                      placeholder="ID da Vacina"
                      editable={false}
                      value={vacinaSelecionada.id_vacinaDependente ? vacinaSelecionada.id_vacinaDependente.toString() : ''}
                      onChangeText={(text) => setVacinaSelecionada({ ...vacinaSelecionada, id_vacinaDependente: text })}
                      />
  
                    {/* Nome da Vacina */}
                    <TextInput
                      placeholder="Nome da Vacina"
                      value={vacinaSelecionada.Nome_Vacina}
                      onChangeText={(text) => setVacinaSelecionada({ ...vacinaSelecionada, Nome_Vacina: text })}
                      />
      
                    {/* Local de Vacinação */}
                    <TextInput
                      style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                      placeholder="Local de Vacinação" value={vacinaSelecionada.Local_Vacinacao} onChangeText={(text) => setVacinaSelecionada({ ...vacinaSelecionada, Local_Vacinacao: text })}
                    />
      
                    {/* Data de Vacinação */}
                      <TextInput
                          style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                          placeholder="Data de Vacinação"
                          value={vacinaSelecionada.Data_Vacinacao}
                           onChangeText={(text) => setVacinaSelecionada({ ...vacinaSelecionada, Data_Vacinacao: text })}
                        />
      
                    {/* Dose */}
                    <TextInput
                      style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                      placeholder="Dose" keyboardType="numeric" value={vacinaSelecionada.Dose ? vacinaSelecionada.Dose.toString() : ''} onChangeText={(text) => setVacinaSelecionada({ ...vacinaSelecionada, Dose: text })}
                    />
                  </View>
                )}
                    <Button title="Salvar" onPress={() => editarVacina(Number(vacinaSelecionada.id_vacinaDependente), vacinaSelecionada.Nome_Vacina, vacinaSelecionada.Local_Vacinacao, vacinaSelecionada.Data_Vacinacao, Number(vacinaSelecionada.Dose))} />
                    <Button title="Cancelar" onPress={() => setIsEditarModalVisible(false)} />
            </Modal>
            {vacinas.length === 0 ? (
                <View><Text>Não há vacinas</Text></View>
            ):(
                <View style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Lista de Vacinas</Text>
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