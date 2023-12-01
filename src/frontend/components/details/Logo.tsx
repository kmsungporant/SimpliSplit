import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function Logo() {
  return (
    <SafeAreaView className="items-center">
      <View className="items-end mt-10">
        <Text className="text-5xl font-black text-Black-color ">
          Simpli <Text className="underline text-Primary-color">Split</Text>
        </Text>
        <Text className="text-lg font-bold text-right text-Black-color">
          Scan, Split, and Settle
        </Text>
      </View>
    </SafeAreaView>
  );
}
