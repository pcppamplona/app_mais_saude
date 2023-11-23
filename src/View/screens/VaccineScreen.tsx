import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export function VaccineScreen({ navigation }) {
  const [vacinas, setVacinas] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
  };

  return (
    <View className="flex-1 flex-col bg-[#fff]">
      <TouchableOpacity
        //onPress={() => toggleModal()}
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

      {vacinas.length === 0 ? (
        <View>
          <View className="flex flex-row w-full justify-between items-center mr-auto py-8 px-4">
            <Text className="font-bold text-2xl text-[#28282D]">Vacinas</Text>
            <Text className="font-bold text-xs text-[#1F9A55]">Ajuda</Text>
          </View>

          <Text className="ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
            Você ainda não possui nenhuma{"\n"} carteira ou vacina cadastrada.
          </Text>
          <Text className="mt-2 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
            Para adicionar uma nova, clique no botão{" "}
            <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>{" "}
            abaixo e{"\n"} digite as demais informações necessárias..
          </Text>
          <Image
            source={require("../../../assets/backgrounds/fundoVacina.png")}
            className="w-full top-[5%]"
          />

          <View className="flex flex-row w-full justify-center">
            <Image
              source={require("../../../assets/illustrations/flecha.png")}
              className="w-[160px] h-[150px] ml-16"
            />
          </View>
        </View>
      ) : (
        <>
        </>
      )}
    </View>
  );
}
