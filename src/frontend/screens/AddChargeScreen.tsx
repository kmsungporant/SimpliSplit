import { Entypo } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView, useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";
import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../components/details/Logo";
import { Orders } from "../interfaces/Orders";

export default function AddChargeScreen({ navigation, route }: any) {
  const { source, user } = route.params;
  const [orderItems, setOrderItems] = useState<Orders[]>([]);
  const [Gratuity, setGratuity] = useState<number>(0.18);
  const [tax, setTax] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef<BottomSheet>(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        getTaxFromZip(response[0].postalCode || "");
      } else {
        Alert.prompt("Your location was denied.", "Enter a tax percentage", [
          {
            text: "Cancel",
            onPress: () => setTax(0.06),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (text: any) => setTax(parseFloat(text) / 100),
          },
        ]);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const getTaxFromZip = async (zip: string) => {
    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`, {
        headers: {
          "X-Api-Key": String(process.env.RAPID_APIKEY),
          "Content-Type": "application/json",
        },
      });

      setTax(parseFloat(response.data[0].total_rate));
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  async function processImage() {
    const endpoint = "https://api.veryfi.com/api/v8/partner/documents/";
    const headers = {
      Accept: "application/json",
      "CLIENT-ID": String(process.env.VERYFI_AUTH),
      AUTHORIZATION: String(process.env.VERYFI_APIKEY),
    };

    const formData = new FormData();
    formData.append("file", {
      uri: source,
      type: "image/jpeg",
      name: "invoice.jpg",
    });

    try {
      const response = await axios.post(endpoint, formData, { headers });
      let res = [];
      for (let i = 0; i < response.data.line_items.length; i++) {
        let temp = {
          itemName: response.data.line_items[i].description,
          price: response.data.line_items[i].total,
          quantity: response.data.line_items[i].quantity,
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
      setFinalPrice(totalPrice * (1 + tax) * (1 + Gratuity));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePriceChange = (text: string, index: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].price = parseFloat(text) || 0;
    setOrderItems(newOrderItems);
  };

  const addItemToOrder = () => {
    if (
      newItemName.trim() === "" ||
      newItemPrice.trim() === "" ||
      isNaN(parseFloat(newItemPrice))
    ) {
      return;
    }

    setOrderItems([...orderItems, { itemName: newItemName, price: parseFloat(newItemPrice) }]);
    setNewItemName("");
    setNewItemPrice("");
  };

  function handleRemoveItem(index: number) {
    setOrderItems((prev: any) => {
      const newOrderItems = [...prev];
      newOrderItems.splice(index, 1);
      return newOrderItems;
    });
  }

  useEffect(() => {
    if (orderItems.length > 0) {
      return;
    }
    getLocation();
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
    setFinalPrice(totalPrice * (1 + tax) * (1 + Gratuity));
  }, [Gratuity, tax, totalPrice]);

  // function handlePress(Item: any) {
  //   setFinalJson((prev: any) => {
  //     const newJson = [...prev];
  //     newJson[currPage].itemsOrdered.pop(Item);
  //     return newJson;
  //   });
  //   setFinalOrderItems((prev: any) => {
  //     const newOrderItems = [...prev];
  //     newOrderItems.push(Item);
  //     return newOrderItems;
  //   });
  // }
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
  function onPressTax() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["5%", "10%", "Custom", "Cancel"],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 4,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            setTax(0.05);
            break;
          case 1:
            setTax(0.1);
            break;
          case 2:
            Alert.prompt("Custom Tax", "Enter a Tax percentage", [
              {
                text: "Cancel",
                onPress: () => setTax(0.06),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: (text: any) => setTax(parseFloat(text) / 100),
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
        <View className="w-full h-full">
          <Logo />

          <View className="z-10 self-center w-4/5 border-b-2 border-white bg-background-color">
            <Text className="px-2 mt-6 text-2xl font-black text-white ">Orders</Text>
          </View>
          <ScrollView className="flex-1 w-full px-12 gap-y-2">
            <View className="py-4">
              {orderItems.map((item: any, i: number) => (
                <View className="flex-row items-center justify-between my-2" key={i}>
                  <View className="flex-row items-start">
                    <Pressable onPress={() => handleRemoveItem(i)}>
                      <Entypo name="circle-with-cross" size={16} color="gray" />
                    </Pressable>
                    <Text className="ml-3 text-white">{item.itemName}</Text>
                  </View>
                  <View className="flex-row ">
                    <Text className="text-white">$</Text>
                    <TextInput
                      className="text-white"
                      onChangeText={(text) => handlePriceChange(text, i)}
                      keyboardType="decimal-pad"
                      value={item.price.toString()}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row items-center justify-between my-2 mr-2">
              <TextInput
                className="justify-center w-1/3 p-1 rounded-md bg-gray-600/50 text-white/70"
                onChangeText={(text) => setNewItemName(text)}
                value={newItemName}
              />
              <View className="flex-row items-center w-12 text-white ">
                <Text className="text-white/70">$</Text>
                <View className="w-full rounded-md bg-gray-600/50 ">
                  <TextInput
                    className="p-1 text-white/70"
                    onChangeText={(text) => setNewItemPrice(text)}
                    value={newItemPrice}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => addItemToOrder()} className="w-fit">
              <Text className="font-black text-white">Add Item +</Text>
            </TouchableOpacity>
          </ScrollView>

          <BottomSheet
            ref={sheetRef}
            snapPoints={["10%", "40%"]}
            animationConfigs={animationConfigs}
          >
            <BottomSheetView className="bottom-0 z-50 self-center w-full pb-5 bg-white rounded-t-3xl">
              <View className="px-12 mt-2">
                <View className="flex-row items-center justify-between ">
                  <Text className="text-xl font-black text-black ">Total Due</Text>
                  <Text className="text-xl font-black text-black">${finalPrice.toFixed(2)}</Text>
                </View>
                <View className="mt-5">
                  <View className="flex-row items-center justify-between ">
                    <Text className="w-24 text-xl text-black">SubTotal</Text>
                    <Text className="text-black">${totalPrice.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between ">
                    <Text className="text-xl text-black">Tax {`(${tax * 100}%)`}</Text>
                    <Text className="text-black">${(totalPrice * tax).toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xl text-black">Gratuity {`(${Gratuity * 100}%)`}</Text>
                    <Text className="text-blacks">
                      ${(totalPrice * (1 + tax) * Gratuity).toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-col items-center justify-between ">
                    <View className="flex-row">
                      <Button onPress={onPressGratuity} title="Select Gratuity" color="#1F6E8C" />
                      <Button onPress={onPressTax} title="Select Tax" color="#1F6E8C" />
                    </View>
                  </View>
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
                            user: user,
                          });
                        }
                  }
                >
                  <Text className="text-lg font-black text-center text-black">Validate</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      )}
    </View>
  );
}
