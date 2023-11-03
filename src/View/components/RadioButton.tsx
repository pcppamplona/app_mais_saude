import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";


const RadioButton = ({ options = [], horizontal = true, onChangeSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
    onChangeSelect(opt);
  };

  return (
    <View className="flex-row mb-4 w-9/12 justify-between">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => handleOptionSelect(opt)}
          className="flex-row items-center"
        >
          <View className="w-6 h-6 border-2 rounded-full border-white mr-2 justify-center items-center">
            {selectedOption === opt && (
              <Icon name="check" size={16} color="#fff" />
            )}
          </View>
          <Text className="text-white">{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
