import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const BotaoEditar = ({ onEditarPress }) => {
  return (
    <TouchableOpacity onPress={onEditarPress}>
      <Text>Editar</Text>
    </TouchableOpacity>
  );
};

const BotaoExcluir = ({ onExcluirPress }) => {
  return (
    <TouchableOpacity onPress={onExcluirPress}>
      <Text>Excluir</Text>
    </TouchableOpacity>
  );
};

export { BotaoEditar, BotaoExcluir };
