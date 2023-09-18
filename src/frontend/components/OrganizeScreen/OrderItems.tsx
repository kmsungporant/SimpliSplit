import { Text, View } from "react-native";

export default function OrderItems({ item }: { item: any }) {
  return (
    <View className="flex-row justify-between w-full p-3 ">
      <Text className="text-xl font-bold text-white">{item.itemName}</Text>
      <Text className="text-xl text-white">${item.price}</Text>
    </View>
  );
}
