import { Pressable, Text, TextInput, View } from "react-native";
import { Orders } from "../../interfaces/Orders";

export default function AddItems(setOrderItems: any, setEditingItem: any, newOrderItems: Orders[]) {
  let name = "";
  let price = 0.0;
  return (
    <View className="w-full">
      <Text className="m-5 text-3xl font-black text-blue-black">Add Item</Text>
      <View className="flex-row items-center justify-between px-5 mt-4">
        <Text className="text-xl font-semibold text-black">Item Name</Text>
        <TextInput
          className="w-3/5 p-2 bg-gray-100 rounded-2xl"
          placeholder="Enter Item Name"
          keyboardAppearance="dark"
          autoCorrect={false}
          autoComplete="off"
          clearButtonMode="always"
          autoCapitalize="sentences"
          onChangeText={(text) => {
            name = text;
          }}
        />
      </View>
      <View className="flex-row items-center justify-between px-5 mt-4">
        <Text className="text-xl font-semibold text-black">Item Price</Text>
        <TextInput
          className="w-3/5 p-2 bg-gray-100 text- rounded-2xl"
          placeholder="Enter Item Price"
          onChangeText={(text) => {
            price = parseFloat(text);
          }}
          keyboardType="decimal-pad"
          keyboardAppearance="dark"
          clearButtonMode="always"
        />
      </View>
      <View className="flex-row justify-between px-3 py-5 ">
        <Pressable
          onPress={() => setEditingItem(-1)}
          className="items-center px-12 py-4 mb-3 bg-Primary-color border-Primary-color rounded-xl"
        >
          <Text className="text-xl font-black">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            newOrderItems.push({ itemName: name, price: price });
            setOrderItems(newOrderItems);
            setEditingItem(-1);
          }}
          className="px-12 py-4 mb-3 bg-green-400 border-black rounded-xl"
        >
          <Text className="w-20 text-xl font-black text-center">Add</Text>
        </Pressable>
      </View>
    </View>
  );
}
