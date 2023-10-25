import { AntDesign, FontAwesome } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView, useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Logo from "../components/details/Logo";
import { Orders } from "../interfaces/Orders";

export default function AddChargeScreen({ navigation, route }: any) {
  const { source, VenmoUserName } = route.params;
  const [orderItems, setOrderItems] = useState<Orders[]>([]);
  const [Gratuity, setGratuity] = useState<number>(0.18);
  const [tax, setTax] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef<BottomSheet>(null);

  async function processImage() {
    const endpoint = "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict";
    const headers = {
      Authorization: "Token 3eb14b2677e44a63b7ba915b2dc97768",
      "Content-Type": "multipart/form-data",
    };

    let data = new FormData();
    data.append("document", { uri: source, name: "receipt.jpg", type: "image/jpeg" });

    try {
      const response = await axios.post(endpoint, data, { headers });
      let res = [];
      for (
        let i = 0;
        i < response.data.document.inference.pages[0].prediction.line_items.length;
        i++
      ) {
        let temp = {
          itemName: response.data.document.inference.pages[0].prediction.line_items[i].description,
          price: response.data.document.inference.pages[0].prediction.line_items[i].total_amount,
          quantity:
            response.data.document.inference.pages[0].prediction.line_items[i].quantity != null
              ? response.data.document.inference.pages[0].prediction.line_items[i].quantity
              : 1,
        };
        if (temp.price !== null) {
          res.push(temp);
        }
      }
      setOrderItems(
        res.flatMap((item: any) => {
          const { itemName, quantity, price } = item;
          return Array.from({ length: quantity }, () => ({ itemName, price }));
        })
      );

      let taxRes = 0;
      for (let i = 0; i < response.data.document.inference.pages[0].prediction.taxes.length; i++) {
        taxRes += response.data.document.inference.pages[0].prediction.taxes[i].value;
      }

      setTax(taxRes);
      if (isNaN(taxRes)) {
        Alert.prompt("Sales Tax Not Found", "Enter Total Tax Amount", [
          {
            text: "Cancel",
            onPress: () => setTax(finalPrice * 0.6),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (text: any) => setTax(parseFloat(text)),
          },
        ]);
      }

      if (res.length === 0) {
        Alert.alert("No Items Found", "Please manually enter the items.");
      }

      setFinalPrice((totalPrice + tax) * (1 + Gratuity));
    } catch (error) {
      Alert.alert("No Items Found", "Please manually enter the items.");
    }
    setLoading(false);
  }

  function handleRemoveItem(index: number) {
    setOrderItems((prev: any) => {
      const newOrderItems = [...prev];
      newOrderItems.splice(index, 1);
      return newOrderItems;
    });
  }

  function changeItem(index: number) {
    const currItem = orderItems[index];
    const newOrderItems = [...orderItems];
    if (index === -2) {
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
    } else {
      if (orderItems.length !== 0) {
        let name = currItem.itemName;
        let price = currItem.price;
        return (
          <View className="w-full">
            <Text className="m-5 text-3xl font-black text-blue-black">Change Item</Text>
            <Pressable
              className="absolute right-5 top-5"
              onPress={() => {
                handleRemoveItem(index);
                setEditingItem(-1);
              }}
            >
              <FontAwesome name="trash" size={30} />
            </Pressable>
            <View className="flex-row items-center justify-between px-5 mt-4">
              <Text className="text-xl font-semibold text-black">Item Name</Text>
              <TextInput
                className="w-3/5 p-2 bg-gray-100 rounded-2xl"
                placeholder="Enter Item Name"
                defaultValue={name}
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
                defaultValue={parseFloat(price.toString()).toFixed(2)}
                onChangeText={(text) => {
                  price = parseFloat(text);
                }}
                keyboardType="decimal-pad"
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
  }

  useEffect(() => {
    if (orderItems.length > 0) {
      return;
    }

    processImage();
  }, []);

  useEffect(() => {
    setTotalPrice(
      parseFloat(
        orderItems
          .reduce((acc: number, curr: any) => {
            return acc + curr.price;
          }, 0)
          .toFixed(2)
      )
    );
  }, [orderItems]);

  useEffect(() => {
    setFinalPrice((totalPrice + tax) * (1 + Gratuity));
    if (orderItems.length === 0) {
      setTax(0);
    }
  }, [Gratuity, tax, totalPrice, editingItem]);

  function onPressGratuity() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["0%", "10%", "20%", "Custom", "Cancel"],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 4,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            setGratuity(0);
            break;
          case 1:
            setGratuity(0.1);
            break;
          case 2:
            setGratuity(0.2);
            break;
          case 3:
            Alert.prompt("Custom Gratuity", "Enter a gratuity percentage", [
              {
                text: "Cancel",
                onPress: () => setGratuity(0.18),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: (text: any) => setGratuity(parseFloat(text) / 100),
              },
            ]);
            break;
          default:
            break;
        }
      }
    );
  }

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <View className="flex-1 bg-background-color">
      {loading ? (
        <>
          <Logo />
          <View className="items-center justify-center h-3/5">
            <Text className="my-10 text-xl font-bold text-center text-white">
              Processing Sales Tax and Orders...
            </Text>
            <ActivityIndicator size="large" />
          </View>
        </>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View className="w-full h-full">
            <Logo />

            <View className="z-10 flex-row self-center justify-between w-4/5 mt-6 border-b-2 border-white bg-background-color">
              <Text className="px-2 text-2xl font-black text-white ">Orders</Text>
              <Pressable onPress={() => setEditingItem(-2)}>
                <AntDesign name="pluscircle" size={24} color="white" />
              </Pressable>
            </View>
            <ScrollView className="flex-1 w-full px-8 gap-y-2">
              <View className="py-4">
                {orderItems.map((item: any, i: number) => (
                  <Pressable
                    className="flex-row items-center justify-between my-2"
                    onPress={() => setEditingItem(i)}
                    key={i}
                  >
                    <Text className="ml-3 text-white text-md w-52">{item.itemName} </Text>
                    <View className="flex-row ">
                      <Text className="text-lg font-black text-white">
                        $
                        {isNaN(item.price) || item.price === 0
                          ? (0).toFixed(2)
                          : item.price.toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {editingItem != -1 ? (
              <KeyboardAvoidingView behavior="padding" className="z-20 bg-white rounded-t-3xl">
                {changeItem(editingItem)}
              </KeyboardAvoidingView>
            ) : (
              <BottomSheet
                ref={sheetRef}
                snapPoints={["10%", "35%"]}
                animationConfigs={animationConfigs}
              >
                <BottomSheetView className="z-50 w-full bg-white rounded-t-3xl">
                  <View className="px-12 mt-2">
                    <View className="flex-row items-center justify-between ">
                      <Text className="text-xl font-black text-black ">Total Due</Text>
                      <Text className="text-xl font-black text-black">
                        ${finalPrice.toFixed(2)}
                      </Text>
                    </View>
                    <View className="my-6">
                      <View className="flex-row items-center justify-between ">
                        <Text className="w-24 text-xl text-black">SubTotal</Text>
                        <Text className="text-black">${totalPrice.toFixed(2)}</Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          Alert.prompt("Custom Tax", "Enter Total Tax Amount", [
                            {
                              text: "Cancel",
                              onPress: () => setTax(totalPrice * 0.6),
                              style: "cancel",
                            },
                            {
                              text: "OK",
                              onPress: (text: any) => setTax(parseFloat(text)),
                            },
                          ]);
                        }}
                        className="flex-row items-center justify-between"
                      >
                        <Text className="text-xl text-black">
                          Tax{" "}
                          {`(${
                            isNaN((tax / totalPrice) * 100)
                              ? "0"
                              : ((tax / totalPrice) * 100).toFixed(2)
                          }%)`}
                        </Text>
                        <Text className="text-black">${`${tax}`}</Text>
                      </Pressable>
                      <Pressable
                        onPress={onPressGratuity}
                        className="flex-row items-center justify-between"
                      >
                        <Text className="text-xl text-black">
                          Gratuity {`(${Math.round(Gratuity * 100)}%)`}
                        </Text>
                        <Text className="text-blacks">
                          ${((totalPrice + tax) * Gratuity).toFixed(2)}
                        </Text>
                      </Pressable>
                    </View>

                    <TouchableOpacity
                      className="p-3 text-4xl font-black bg-green-400 rounded-2xl "
                      onPress={
                        orderItems.length === 0
                          ? () => Alert.alert("Error", "You must have at least one order items.")
                          : () => {
                              navigation.navigate("Contacts", {
                                orderItems: orderItems,
                                source: source,
                                Gratuity: Gratuity,
                                tax: tax,
                                finalPrice: finalPrice,
                                subTotal: totalPrice,
                                VenmoUserName: VenmoUserName,
                              });
                            }
                      }
                    >
                      <Text className="text-lg font-black text-center text-black">Validate</Text>
                    </TouchableOpacity>
                  </View>
                </BottomSheetView>
              </BottomSheet>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
