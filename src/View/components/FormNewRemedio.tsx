import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInputMask } from 'react-native-masked-text'

interface FormNewRemedioProps {
  isVisible: boolean;
  closeModal: () => void;
  addRemedio: (novoRemedio: Remedio) => void;
}

interface Remedio {
  nomeRemedio: string;
  horarioInicial: string;
  quantidadeDias: string;
  frequencia: string;
}

const FormNewRemedio: React.FC<FormNewRemedioProps> = ({ isVisible, closeModal, addRemedio }) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isFrequencyPickerVisible, setFrequencyPickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const [nomeRemedio, setNomeRemedio] = useState('');
  const [horarioInicial, setHorarioInicial] = useState('');
  const [quantidadeDias, setQuantidadeDias] = useState('');
  const [frequencia, setFrequencia] = useState('');

  const handleCreateRemedio = () => {
    const novoRemedio: Remedio = {
      nomeRemedio,
      horarioInicial,
      quantidadeDias,
      frequencia
    };

    addRemedio(novoRemedio);
    closeModal();
  };

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



  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Adicionar Remédio</Text>
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
        <TouchableOpacity style={styles.buttonCreate} onPress={handleCreateRemedio}>
          <Text style={styles.buttonText}>Criar</Text>
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

export default FormNewRemedio;
