import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BotaoEditar, BotaoExcluir } from './btnEditarExcluirRemedio';

interface RemedioProps {
  id_remedio: number,
  Nome_Remedio: string;
  Quantidade_Dias: number;
  Frequencia: string;
  Doses_Atrasadas: number;
  Qntd_DosesRestantes: number;
  Status: string;
  onEditarPress: () => void; // Função para lidar com a ação de editar
  onExcluirPress: () => void;
}

const Remedio: React.FC<RemedioProps> = ({
  id_remedio,
  Nome_Remedio,
  Quantidade_Dias,
  Frequencia,
  Doses_Atrasadas,
  Qntd_DosesRestantes,
  Status,
  onEditarPress, 
  onExcluirPress,
}) => {
  return (
    <View style={styles.container}>
      <Text>Id:{id_remedio}</Text>
      <Text style={styles.nomeRemedio}>{Nome_Remedio}</Text>
      <Text>Quantidade de Dias: {Quantidade_Dias}</Text>
      <Text>Frequência: {Frequencia}</Text>
      <Text>Doses Atrasadas: {Doses_Atrasadas}</Text>
      <Text>Doses Restantes: {Qntd_DosesRestantes}</Text>
      <Text>Status: {Status}</Text>

      <BotaoEditar onEditarPress={onEditarPress} />
      <BotaoExcluir onExcluirPress={onExcluirPress} />
      {/* Adicione aqui mais informações e estilizações conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nomeRemedio: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Remedio;