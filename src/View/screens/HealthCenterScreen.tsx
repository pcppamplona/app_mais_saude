import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import IconSearch from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import healthData from "../../Controller/healthData.json";

export function HealthCenterScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  useEffect(() => {
    setData(healthData);
  }, []);

  /*  const renderItem = ({ item }) => (
    <View>
      <Text>{item.ESTABELECI}</Text>
      <Text>{item.ENDERECO}</Text>
    </View>
  ); */

  //Render dos items do FlatList, que chamam os dados do Json
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpandedItem(item.ID)}>
      <View className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md">
        <Text className="text-sm font-bold text-[#333]">{item.ESTABELECI}</Text>
        <View className="flex flex-row">
        <Text className="text-xs text-[#555]">{item.ENDERECO}</Text>
        <Text className="text-xs text-[#555] ml-2"> -  {item.DISTRITO}</Text>
        </View>
        {expandedItem === item.ID && (
          <>
          <View className="flex flex-row items-center mt-2">
            <Text className="text-xs font-bold text-[#555]">Subprefeitura:  </Text>
            <Text className="text-xs text-[#555]">{item.SUBPREF}</Text>
          </View>
            <Text className="text-xs text-[#555]">{item.CEP}</Text>
            <Text className="text-xs text-[#555]">{item.TELEFONE}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
  
  //Lógica para fechar o expanded
  const toggleExpandedItem = (itemId) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemId ? null : itemId
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#28282D]">
          Redes de Saúde
        </Text>
        <TouchableOpacity onPress={() => toggleSearchBar()} className="">
          <Icon name="filter" size={15} color="#2BB459" />
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa (condicional) */}
      {isSearchBarVisible && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 8,
          }}
        >
          <TextInput
            className="flex-1 border-[1px] border-[#ccc] rounded-lg px-2"
            placeholder="Pesquisar..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity className="ml-2" onPress={() => closeSearchBar()}>
            <IconSearch name="times" size={20} color="#2BB459" />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        className="py-2"
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID.toString()}
      />
    </View>
  );
}
