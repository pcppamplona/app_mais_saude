import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TextInputMask } from 'react-native-masked-text';

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

const FormNewRemedio: React.FC<FormNewRemedioProps> = ({
  isVisible,
  closeModal,
  addRemedio,
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isFrequencyPickerVisible, setFrequencyPickerVisibility] =
    useState(false);
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
      frequencia,
    };

    addRemedio(novoRemedio);
    closeModal();
  };

  return (
    <View className="bg-white rounded p-4">
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold">Adicionar Remédio</Text>
        <TouchableOpacity onPress={closeModal}>
          <FontAwesome name="close" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View className="mt-4">
        <TextInput
          className="border border-gray-500 rounded mb-4 p-2"
          placeholder="Nome do Remédio"
          value={nomeRemedio}
          onChangeText={setNomeRemedio}
        />
        <TextInputMask
          placeholder="Horário Inicial (hh:mm:ss)"
          value={horarioInicial}
          type={'datetime'}
          options={{
            format: 'hh:mm:ss',
          }}
          onChangeText={setHorarioInicial}
        />
        <TextInput
          className="border border-gray-500 rounded mb-4 p-2"
          placeholder="Quantidade de Dias"
          keyboardType="numeric"
          value={quantidadeDias}
          onChangeText={setQuantidadeDias}
        />
        <TextInputMask
          placeholder="Frequência (hh:mm:ss)"
          value={frequencia}
          type={'datetime'}
          options={{
            format: 'hh:mm:ss',
          }}
          onChangeText={setFrequencia}
        />
      </View>
      <View className="mt-4 items-end">
        <TouchableOpacity
          className="bg-green-500 rounded p-2"
          onPress={handleCreateRemedio}
        >
          <Text className="text-white text-base">Criar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormNewRemedio;
