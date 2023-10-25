import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

export default function Search({ setSearchText }: any) {
  return (
    <View className="fixed bottom-0 w-full bg-transparent">
      <View className="flex-row items-center px-4 py-1 bg-gray-500 rounded-3xl">
        <Ionicons name="ios-search" size={24} color="white" className="" />
        <TextInput
          className="flex-1 pt-3 pb-3 pl-3"
          placeholder="Search contacts"
          onChangeText={(text) => setSearchText(text)}
          clearButtonMode="while-editing"
          placeholderTextColor="white"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
