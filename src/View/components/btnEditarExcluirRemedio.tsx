import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import DeleteIcon from "react-native-vector-icons/Fontisto";
import EditIcon from "react-native-vector-icons/FontAwesome5";

const BotaoEditar = ({ onEditarPress }) => {
  return (
    <TouchableOpacity className="flex-row items-center p-2 bg-green-500 rounded-md" onPress={onEditarPress}>
      <Text className="mr-2 text-white font-semibold text-[11px]">Editar</Text>
      <EditIcon name="edit" size={13} color="#fff" />
    </TouchableOpacity>
  );
};

const BotaoExcluir = ({ onExcluirPress }) => {
  return (
    <TouchableOpacity className='flex flex-row items-center rounded-md px-2 bg-[#FF183F] ml-5' onPress={onExcluirPress}>
      <Text className='mr-2 text-white font-semibold text-[11px]'>Excluir</Text>
      <DeleteIcon name="close" size={13} color="#fff" />
    </TouchableOpacity>
  );
};

export { BotaoEditar, BotaoExcluir };