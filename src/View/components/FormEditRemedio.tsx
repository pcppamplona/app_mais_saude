import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInputMask } from 'react-native-masked-text'
import RemedioController from '../../Controller/RemedioController';
import { usuarioSessao } from '../screens/LoginScreen';

interface FormEditRemedioProps {
  id_remedio:number;
  isVisible: boolean;
  closeModal: () => void;
  editedRemedio: (novoRemedio: Remedio) => void;
  editarNotificacao: (idRemedio: number, novoNome:string, novoHorario: string, novaqntdDias: number, novaFrequencia: string) => void;
}

interface Remedio {
  id_remedio:number;
  nomeRemedio: string;
  horarioInicial: string;
  quantidadeDias: string;
  frequencia: string;
}

const FormEditRemedio: React.FC<FormEditRemedioProps> = ({ editarNotificacao, isVisible, closeModal, editedRemedio, id_remedio }) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isFrequencyPickerVisible, setFrequencyPickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [horarioInicial, setHorarioInicial] = useState('');
  const [quantidadeDias, setQuantidadeDias] = useState('');
  const [frequencia, setFrequencia] = useState('');

//   const handleCreateRemedio = () => {
//     const novoRemedio: Remedio = {
//       id_remedio,
//       nomeRemedio,
//       horarioInicial,
//       quantidadeDias,
//       frequencia
//     };

//     editedRemedio(novoRemedio);
//     closeModal();
//   };

  const handleEditarRemedio = async () =>{
    try{
        const id_usuario = usuarioSessao;
        const qntdDiasFinal = parseInt(quantidadeDias)
        await editarNotificacao(id_remedio, nomeRemedio, horarioInicial, qntdDiasFinal, frequencia)
        RemedioController.EditarRemedio(id_usuario, id_remedio, nomeRemedio, horarioInicial, qntdDiasFinal, frequencia);
        closeModal();
    }catch(error){
        console.log("Erro ao atualizar remédio")
    }
  }

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  useEffect(() =>{
    console.log(id_remedio)
    RemedioController.BuscarRemedioId(id_remedio)
    .then((data) => {
      setNomeRemedio(data[0].Nome_Remedio);
      setHorarioInicial(data[0].Horario_Inicial);
      const qntdDias = data[0].Quantidade_Dias.toString()
      setQuantidadeDias(qntdDias);
      setFrequencia(data[0].Frequencia)
    })
    .catch((error) => {
      console.error("Erro ao buscar remédio:", error);
    });
  },[])



  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Editar Remédio</Text>
        <TouchableOpacity onPress={closeModal}>
          <FontAwesome name="close" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.modalBody}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Remédio"
          value={nomeRemedio}
          onChangeText={setNomeRemedio}
        />
        <TextInputMask
        placeholder="Horário Inicial(hh:mm:ss)"
        value={horarioInicial}
        type={'datetime'}
        options={{
          format: 'hh:mm:ss'
        }}
        onChangeText={setHorarioInicial}
      />
        <TextInput
          style={styles.input}
          placeholder="Quantidade de Dias"
          keyboardType='numeric'
          value={quantidadeDias}
          onChangeText={setQuantidadeDias}
        />
       <TextInputMask
        placeholder="Frequência (hh:mm:ss)"
        value={frequencia}
        type={'datetime'}
        options={{
          format: 'hh:mm:ss'
        }}
        onChangeText={setFrequencia}
      />
      </View>
      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.buttonCreate} onPress={handleEditarRemedio}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
  },
  modalBody: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalFooter: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  buttonCreate: {
    backgroundColor: 'green',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FormEditRemedio;
