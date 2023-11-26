import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/Fontisto";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Abr.",
    "Maio",
    "Jun.",
    "Jul.",
    "Ago.",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
};

LocaleConfig.defaultLocale = "pt-br";

export function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const markDate = (date) => {
    const updatedMarkedDates = {
      ...markedDates,
      [date]: { selected: true, marked: true, selectedColor: "blue" },
    };
    setMarkedDates(updatedMarkedDates);
  };
  return (
    <View className="flex-1 flex-col">
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}

      <View className="flex flex-row w-11/12 justify-between items-center ml-4 mr-auto mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold my-4 text-center">Calendário</Text>
      <Calendar
        current={new Date().toISOString().split("T")[0]}
        onDayPress={(day) => {
          handleDateSelect(day);
          markDate(day.dateString);
        }}
        markedDates={markedDates}
        monthFormat={"MMMM yyyy"}
        hideExtraDays={true}
        theme={{
          todayTextColor: "green",
          selectedDayBackgroundColor: "blue",
          selectedDayTextColor: "white",
        }}
      />
      <View style={styles.selectedDateContainer}>
        <Text className="'text-lg font-semibold">
          Data Selecionada:{" "}
          {selectedDate ? selectedDate : "Nenhuma data selecionada"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedDateContainer: {
    margin: 20,
    alignItems: "center",
  },
});
