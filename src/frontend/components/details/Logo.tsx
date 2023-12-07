import React from "react";
import { Text, View } from "react-native";

export default function Logo() {
  return (
    <View className="items-center">
      <View className="items-end mt-10">
        <Text className="pt-1 text-5xl font-black text-Black-color">
          Simpli <Text className="underline text-Primary-color">Split</Text>
        </Text>
        <Text className="text-lg font-bold text-right text-Black-color">
          Scan, Split, and Settle
        </Text>
      </View>
    </View>
  );
}
