import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Orders } from "../../interfaces/Orders";

function handleSplitItem(
  index: number,
  orderItems: Orders[],
  setOrderItems: any,
  setEditingItem: any
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
            let itemName = `${orderItems[index].itemName} (Split of ${splitNum})`;
            let price = orderItems[index].price / splitNum;
            let newItems = Array.from({ length: splitNum }, (_, i) => ({
              itemName: itemName,
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
}
export default function EditItems(
  orderItems: Orders[],
  setOrderItems: any,
  setEditingItem: any,
  handleRemoveItem: any,
  currItem: Orders,
  index: number,
  newOrderItems: Orders[]
) {
  if (orderItems.length !== 0) {
    let name = currItem.itemName;
    let price = currItem.price;
    return (
      <View className="w-full">
        <Text className="m-5 text-3xl font-black text-black">Change Item</Text>
        <View className="absolute flex-row right-5 top-5">
          <Pressable
            onPress={() => handleSplitItem(index, orderItems, setOrderItems, setEditingItem)}
            className="mr-4"
          >
            <MaterialCommunityIcons name="set-split" size={30} color="black" />
          </Pressable>
          <Pressable
            onPress={() => {
              handleRemoveItem(index);
              setEditingItem(-1);
            }}
          >
            <FontAwesome name="trash" size={30} color="black" />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between px-5 mt-4">
          <Text className="text-xl font-semibold text-black">Item Name</Text>
          <TextInput
            className="w-3/5 p-2 bg-gray-100 rounded-2xl"
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
          <TextInput
            className="w-3/5 p-2 bg-gray-100 text- rounded-2xl"
            placeholder="Enter Item Price"
            defaultValue={parseFloat(price.toString()).toFixed(2)}
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
            onPress={() => setEditingItem(-1)}
            className="items-center px-12 py-4 mb-3 bg-Primary-color border-Primary-color rounded-xl"
          >
            <Text className="text-xl font-black">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              newOrderItems[index].price = price || 0.0;
              newOrderItems[index].itemName = name;
              setOrderItems(newOrderItems);
              setEditingItem(-1);
            }}
            className="items-center px-12 py-4 mb-3 bg-green-400 border-black rounded-xl "
          >
            <Text className="w-20 text-xl font-black text-center">Update</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
