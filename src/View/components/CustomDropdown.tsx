import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";

const CustomDropdown = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onValueChange(item);
        setModalVisible(false);
      }}
      className="py-2 px-4 border-b border-gray-200"
    >
      <Text className="text-base">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="py-2 px-4 ml-1 border border-gray-300 rounded-md"
      >
        <Text className="text-base">{selectedValue || placeholder}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-4 rounded-md shadow-md w-11/12">
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={(item) => item}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 p-2 bg-gray-200 rounded-md"
            >
              <Text className="text-base">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;
