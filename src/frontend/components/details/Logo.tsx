import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Logo() {
  return (
    <SafeAreaView className="items-center">
      <View className="items-end mt-10">
        <Text className="text-5xl font-black text-white ">
          Simpli <Text className="underline text-Primary-color">Split</Text>
        </Text>
        <Text className="text-lg font-bold text-right text-gray-500">Scan, Split, and Settle</Text>
      </View>
    </SafeAreaView>
  );
}
