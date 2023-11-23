import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import IconList from "react-native-vector-icons/Entypo";
import IconList2 from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome5";
import healthData from "../../Controller/healthData.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usuarioSessao } from "./LoginScreen";

export function HealthCenterScreen({ navigation }) {
  const [data, setData] = useState([]);

  // State para verificar se existe algum card expandido
  const [expandedItem, setExpandedItem] = useState(null);

  // State para verificar se o usuário está procurando algum item
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // State de visibilidade da searchBar
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  // State da visibilidade dos Filtros
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // State dos cards favoritos
  const [favorites, setFavorites] = useState([]);

  // Toggles para abrir e fechar a search Bar Condicional
  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
    setSearchText("");
  };
  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
    setSearchText("");
  };

  // Toggles para abrir e fechar a filtro Condicional
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  const closeFilter = () => {
    setIsFilterVisible(false);
  };

  // useEffect do Json
  useEffect(() => {
    setData(healthData);
  }, []);

  // useEffect para fazer o filtro de searchbar
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.ESTABELECI.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  useEffect(() => {
    // Carregar favoritos do AsyncStorage quando o componente montar
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
    setData(healthData);
  }, []);

  useEffect(() => {
    // Salvar favoritos no AsyncStorage sempre que houver uma mudança
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    };

    saveFavorites();
  }, [favorites]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.ESTABELECI.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const toggleFavorite = (itemId) => {
    const userId = usuarioSessao; // Assumindo que usuarioSessao contém o ID do usuário
  
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter((id) => id !== itemId));
    } else {
      if (favorites.length < 2) {
        setFavorites([...favorites, itemId]);
  
        // Salvar favoritos com o ID do usuário
        saveFavoritesWithUserId(userId, [...favorites, itemId]);
      }
    }
  };
  
  const saveFavoritesWithUserId = async (userId, favoritesArray) => {
    try {
      // Obter favoritos existentes para o usuário
      const storedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
  
      let userFavorites = [];
      if (storedFavorites) {
        userFavorites = JSON.parse(storedFavorites);
      }
  
      // Atualizar e salvar os favoritos para o usuário
      userFavorites = [...userFavorites, ...favoritesArray];
      await AsyncStorage.setItem(`favorites_${userId}`, JSON.stringify(userFavorites));
    } catch (error) {
      console.error("Erro ao salvar os favoritos:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const userId = usuarioSessao; // Assumindo que usuarioSessao contém o ID do usuário
  
      // Obter favoritos do usuário
      const storedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Erro ao carregar os favoritos:", error);
    }
  };
  
  //Render dos items do FlatList, que chamam os dados do Json
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpandedItem(item.ID)}>
      <View className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md">
        <View className="flex flex-row items-center justify-between">
          <View className="flex w-10 h-10 justify-center items-center bg-gray-100 rounded-full mr-3">
            <View>
              <Image
                source={require("../../../assets/illustrations/hospital.png")}
                className="w-10 h-10"
              />
              {/* <Text>Pedro</Text> */}
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-sm font-bold text-[#333] w-8/12">
              {item.ESTABELECI}
            </Text>
            <View className="flex flex-row w-7/12">
              <Text className="text-[10px] text-[#555]">{item.ENDERECO}</Text>
              <Text className="text-[10px] text-[#555] ml-2">
                {" "}
                - {item.DISTRITO}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => toggleFavorite(item.ID)}>
            <Icon
              name="star"
              size={14}
              color={favorites.includes(item.ID) ? "#EDDF82" : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        {expandedItem === item.ID && (
          <>
            <View className="flex flex-row items-center mt-2">
              <IconList2 name="home-city" size={12} color="#2BB459" />
              <Text className="text-xs font-bold text-[#555] ml-2">
                Prefeitura:{" "}
              </Text>
              <Text className="text-xs text-[#555]">{item.SUBPREF}</Text>
            </View>

            <View className="flex flex-row items-center mt-1">
              <IconList name="address" size={12} color="#2BB459" />
              <Text className="text-xs font-bold text-[#555] ml-2">CEP: </Text>
              <Text className="text-xs text-[#555]">{item.CEP}</Text>
            </View>

            <View className="flex flex-row items-center mt-1">
              <IconList name="phone" size={12} color="#2BB459" />
              <Text className="text-xs font-bold text-[#555] ml-2">
                Contato:{" "}
              </Text>
              <Text className="text-xs text-[#555]">{item.TELEFONE}</Text>
            </View>
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
      <TouchableOpacity
        onPress={isSearchBarVisible ? closeSearchBar : toggleSearchBar}
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
          backgroundColor: isSearchBarVisible ? "#FF5C53" : "#2BB459",
        }}
      >
        <Icon
          name={isSearchBarVisible ? "close-a" : "search"}
          size={15}
          color="white"
        />
      </TouchableOpacity>

      <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#28282D]">
          Redes de Saúde
        </Text>
        <TouchableOpacity  onPress={isFilterVisible ? closeFilter : toggleFilter}>
          <IconFontAwesome 
            name={isFilterVisible ? "times" : "filter"}
            size={18} 
            color="#2BB459" 
          />
        </TouchableOpacity>
      </View>

      {/* Filtros Condicionais */}
      {isFilterVisible && (
        <View className="flex flex-row w-11/12 mt-4 justify-center">
          <Text className="text-black">Filtros</Text>
        
        </View>
      )}

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
            placeholder="Pesquisar Nome..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          {/* <TouchableOpacity className="ml-2" onPress={() => closeSearchBar()}>
            <IconFontAwesome name="times" size={20} color="#2BB459" />
          </TouchableOpacity> */}
        </View>
      )}

      {/* Adicione um componente de texto e borda condicional acima da FlatList */}
      {favorites.length !== 0 && (
        <View className="flex flex-row w-11/12 mt-4 items-center justify-start">
          <Text className="text-sm font-bold mr-1 text-[#727275]">
            Fixiados 
          </Text>
          <IconFontAwesome name="thumbtack" size={12} color="#727275" />
        </View>
      )}

      <FlatList
        className="py-2 w-11/12"
        data={[
          ...favorites.map((id) => data.find((item) => item.ID === id)),
          
          ...filteredData.filter((item) => !favorites.includes(item.ID)),
        ]}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID.toString()}
      />
    </View>
  );
}
