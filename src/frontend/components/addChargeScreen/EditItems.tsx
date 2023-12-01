import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Alert, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { Orders } from "../../interfaces/Orders";

function handleSplitItem(
  index: number,
  orderItems: Orders[],
  setOrderItems: any,
  setEditingItem: any,
  ref: any
) {
  let splitNum: number = 1;

  Alert.prompt(
    "Split Item",
    "How many times do you want to split the item?",
    [
      {
        text: "Cancel",
        style: "destructive",
        onPress: () => {},
      },
      {
        text: "OK",
        onPress: (text: string | undefined) => {
          if (text) {
            splitNum = parseFloat(text);
            let price = orderItems[index].price / splitNum;
            let newItems = Array.from({ length: splitNum }, (_, i) => ({
              itemName: `${orderItems[index].itemName} (${i + 1} of ${splitNum})`,
              price: price,
            }));
            const updatedOrderItems = [...orderItems];
            updatedOrderItems.splice(index, 1);
            updatedOrderItems.splice(index, 0, ...newItems);
            setOrderItems(updatedOrderItems);
            setEditingItem(-1);
          }
        },
      },
    ],
    "plain-text",
    "",
    "number-pad"
  );
  ref.current?.close();
}

function handleRemoveItem(index: number, setOrderItems: any, ref: any) {
  setOrderItems((prev: any) => {
    const newOrderItems = [...prev];
    newOrderItems.splice(index, 1);
    return newOrderItems;
  });
  ref.current?.close();
  Keyboard.dismiss();
}
const EditItems = forwardRef(
  (
    {
      currItem,
      index,
      orderItems,
      setOrderItems,
      setEditingItem,
    }: {
      index: number;
      currItem: Orders;
      orderItems: Orders[];
      setOrderItems: any;
      setEditingItem: any;
    },
    ref: any
  ) => {
    let name = currItem?.itemName;
    let price = currItem?.price;
    return (
      <View className="z-50 w-full">
        <Text className="mx-5 text-3xl font-black text-black">Change Item</Text>
        <View className="absolute flex-row right-5 ">
          <Pressable
            onPress={() => handleSplitItem(index, orderItems, setOrderItems, setEditingItem, ref)}
            className="mr-4"
          >
            <MaterialCommunityIcons name="set-split" size={30} color="black" />
          </Pressable>
          <Pressable
            onPress={() => {
              handleRemoveItem(index, setOrderItems, ref);
            }}
          >
            <FontAwesome name="trash" size={30} color="black" />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between px-5 mt-4">
          <Text className="text-xl font-semibold text-black">Item Name</Text>
          <BottomSheetTextInput
            style={{ width: "60%", padding: 8, backgroundColor: "#F3F4F6", borderRadius: 16 }}
            placeholder="Enter Item Name"
            defaultValue={name}
            onChangeText={(text) => {
              name = text;
            }}
            keyboardAppearance="dark"
            autoCorrect={false}
            autoComplete="off"
            clearButtonMode="always"
            autoCapitalize="sentences"
          />
        </View>
        <View className="flex-row items-center justify-between px-5 mt-4">
          <Text className="text-xl font-semibold text-black">Item Price</Text>
          <BottomSheetTextInput
            style={{ width: "60%", padding: 8, backgroundColor: "#F3F4F6", borderRadius: 16 }}
            placeholder="Enter Item Price"
            defaultValue={parseFloat(price?.toString()).toFixed(2)}
            onChangeText={(text) => {
              price = parseFloat(text);
            }}
            keyboardType="decimal-pad"
            keyboardAppearance="dark"
            clearButtonMode="always"
          />
        </View>
        <View className="flex-row justify-between px-3 my-5">
          <Pressable
            onPress={() => {
              ref.current?.close();
              Keyboard.dismiss();
            }}
            className="items-center px-12 py-4 mb-3 bg-Primary-color border-Primary-color rounded-xl"
          >
            <Text className="text-xl font-black">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const updatedOrderItems = [...orderItems];
              updatedOrderItems.splice(index, 1, { itemName: name, price: price });
              setOrderItems(updatedOrderItems);
              ref.current?.close();
              Keyboard.dismiss();
            }}
            className="items-center px-12 py-4 mb-3 bg-green-400 border-black rounded-xl "
          >
            <Text className="w-20 text-xl font-black text-center">Update</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

export default EditItems;
