import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { Alert, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { Orders } from "../../interfaces/Orders";

const AddItems = forwardRef(
  ({ setOrderItems, orderItems }: { setOrderItems: any; orderItems: Orders[] }, ref: any) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(0.0);

    function handleSubmit() {
      setOrderItems([...orderItems, { itemName: name, price: price }]);
      setName("");
      setPrice(0.0);
      Keyboard.dismiss();
      ref?.current?.close();
    }

    return (
      <View className="z-50 w-full">
        <Text className="mx-5 text-3xl font-black text-blue-black">Add Item</Text>
        <View className="flex-row items-center justify-between px-5 mt-5">
          <Text className="text-xl font-semibold text-black ">Item Name</Text>
          <BottomSheetTextInput
            style={{
              width: "60%",
              padding: 8,
              backgroundColor: "#F3F4F6",
              borderRadius: 16,
            }}
            placeholder="Enter Item Name"
            keyboardAppearance="dark"
            autoCorrect={false}
            autoComplete="off"
            clearButtonMode="always"
            autoCapitalize="sentences"
            onChangeText={(text) => {
              setName(text);
            }}
            value={name}
          />
        </View>
        <View className="flex-row items-center justify-between px-5 mt-4">
          <Text className="text-xl font-semibold text-black">Item Price</Text>
          <BottomSheetTextInput
            style={{ width: "60%", padding: 8, backgroundColor: "#F3F4F6", borderRadius: 16 }}
            placeholder="Enter Item Price"
            onChangeText={(text) => {
              setPrice(parseFloat(text));
            }}
            keyboardType="decimal-pad"
            keyboardAppearance="dark"
            clearButtonMode="always"
            value={price?.toString()}
          />
        </View>
        <View className="flex-row justify-between px-3 py-5 ">
          <Pressable
            onPress={() => ref?.current?.close()}
            className="items-center px-12 py-4 mb-3 bg-Black-color rounded-xl"
          >
            <Text className="text-xl font-black text-white">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (name === "" || price === 0.0) {
                Alert.alert("Invalid Input", "Please enter a valid item name and price");
                return;
              }
              handleSubmit();
            }}
            className="px-12 py-4 mb-3 border-black bg-Primary-color rounded-xl"
          >
            <Text className="w-20 text-xl font-black text-center text-white">Add</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

export default AddItems;
