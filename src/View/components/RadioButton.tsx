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
    <View style={{ flexDirection: horizontal ? "row" : "column", marginBottom: 4, width: "75%", justifyContent: "space-between" }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => handleOptionSelect(opt)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ width: 24, height: 24, borderWidth: 2, borderRadius: 12, borderColor: "white", marginRight: 8, justifyContent: "center", alignItems: "center" }}>
            {selectedOption === opt && (
              <Icon name="check" size={16} color="#fff" />
            )}
          </View>
          <Text style={{ color: "white" }}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
