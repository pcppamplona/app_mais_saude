import React from "react";
import { View, Text, Image } from "react-native";
import { BotaoEditar, BotaoExcluir } from "./btnEditarExcluirRemedio";
import Icon from "react-native-vector-icons/FontAwesome";

interface RemedioProps {
  Nome_Remedio: string;
  Quantidade_Dias: number;
  Frequencia: string;
  Doses_Atrasadas: number;
  Qntd_DosesRestantes: number;
  Status: boolean;
  expanded: boolean;
  onEditarPress: () => void;
  onExcluirPress: () => void;
}

const Remedio: React.FC<RemedioProps> = ({
  Nome_Remedio,
  Quantidade_Dias,
  Frequencia,
  Doses_Atrasadas,
  Qntd_DosesRestantes,
  Status,
  expanded,
  onEditarPress,
  onExcluirPress,
}) => {
  return (
    <View className="bg-white p-3 mb-3 rounded-xl border-[1px] border-[#ccc]">
      <View className="flex flex-row items-center justify-between">
        {/* Parte 1: Icone */}
        <View className="flex w-10 h-10 justify-center items-center bg-gray-300 rounded-full mr-3">
          <View>
            <Image
              source={require("../../../assets/backgrounds/remedy.png")}
              className="w-11 h-14"
            />
            {/* <Text>Pedro</Text> */}
          </View>
        </View>

        {/* Parte 2: Nome do remédio e Frequência */}
        <View className="flex-1">
          <Text className="text-base font-bold">{Nome_Remedio}</Text>
          <Text className="text-sm">{Frequencia}</Text>
        </View>

        {/* Parte 3: Status e outras informações (se expandido) */}
        <View className="flex flex-row">
          {Doses_Atrasadas > 0 ? (
            <>
              <Text>Atrasadas: {Doses_Atrasadas}</Text>
              <Text className="mt-1">
                <Icon name="warning" size={15} color="#FD151B" /> Atrasadas:{" "}
                {Doses_Atrasadas}
              </Text>
            </>
          ) : (
            <Text className="text-[#2BB459] font-semibold">Em dia</Text>
          )}
        </View>
      </View>

      {expanded && (
        <>
          <View className="mt-2 ml-2">
            <Text className="mt-2">
              <Icon name="calendar" size={15} color="#57A5C4" />  Quantidade de
              Dias: {Quantidade_Dias}
            </Text>
            <Text className="mt-1">
              <Icon name="clipboard" size={15} color="#479962" />  Doses
              Restantes: {Qntd_DosesRestantes}
            </Text>
            <Text className="mt-1 ml-1">
              <Icon name="info" size={15} color="#FCCA60" />    Status: {Status ? 'Finalizado' : 'Em andamento'}
            </Text>
            <Text className="mt-1">
              <Icon name="warning" size={15} color="#FD151B" />   Doses Atrasadas:{" "}
              {Doses_Atrasadas}
            </Text>
          </View>

          {/* Botões de edição/exclusão */}
          <View className="flex flex-row justify-start mt-6">
            <BotaoEditar onEditarPress={onEditarPress} />
            <BotaoExcluir onExcluirPress={onExcluirPress} />
          </View>
        </>
      )}
    </View>
  );
};

export default Remedio;
