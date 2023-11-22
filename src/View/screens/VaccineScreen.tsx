import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";

import { usuarioSessao } from "./LoginScreen";
import ModalRemedio from "react-native-modal";
import FormNewRemedio from "../components/FormNewRemedio";
import FormEditRemedio from "../components/FormEditRemedio";
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
    <TouchableWithoutFeedback onPress={() => closeSearchBar()}>
      <View className="flex-1 flex-col bg-[#fff]">
        <TouchableOpacity
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
          <Icon name="plus" size={22} color="white" />
        </TouchableOpacity>

        {vacinas.length === 0 ? (
          <View>
            <View className="ml-4 mr-auto mt-10 mb-10">
              <Text className="font-bold text-2xl text-[#28282D]">
                Vacinas
              </Text>
            </View>
            <Image
              source={require("../../../assets/")}
              className="w-full h-auto top-[5%] bottom-0 animate-pulse"
            />
            <Text className="mt-10 ml-auto mr-auto line-clamp-2 items-center text-center text-lg text-[#1F9A55] font-bold">
              Você ainda não possui nenhuma{"\n"} vacina cadastrado.
            </Text>
            <Text className="mt-14 ml-auto mr-auto line-clamp-2 items-center text-center text-sm text-[#282b29] font-roboto">
              Para adicionar uma nova, clique no botão{" "}
              <Text className="text-lg text-[#1F9A55] font-semibold">+</Text>
            </Text>
          </View>
        ) : (
          <>
            <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto mt-10">
              <Text className="font-bold text-2xl text-[#28282D]">
                Medicamentos
              </Text>
              <TouchableOpacity onPress={() => toggleSearchBar()} className="">
                <Icon name="filter" size={15} color="#2BB459" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
