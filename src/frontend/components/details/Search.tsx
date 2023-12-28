import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { TextInput, View } from "react-native";

export default function Search({ setSearchText }: any) {
  return (
    <View className="fixed bottom-0 w-full bg-transparent">
      <View className="flex-row items-center px-4 py-1 bg-zinc-700/10 rounded-3xl">
        <Ionicons name="ios-search" size={24} color="#454545" />
        <TextInput
          className="flex-1 pt-3 pb-3 pl-3 text-Black-color"
          placeholder="Search contacts"
          onChangeText={(text) => setSearchText(text)}
          clearButtonMode="while-editing"
          placeholderTextColor="#454545"
          keyboardAppearance="dark"
          autoCorrect={false}
          autoComplete="off"
        />
      </View>
    </View>
  );
}
