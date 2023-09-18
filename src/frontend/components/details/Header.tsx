import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between h-24 bg-slate-800">
      <TouchableOpacity className="flex-row items-center ml-4 top-4">
        <AntDesign name="left" size={24} color="white" />
        <Text className="text-xl text-white"> Back</Text>
      </TouchableOpacity>
    </View>
  );
}
