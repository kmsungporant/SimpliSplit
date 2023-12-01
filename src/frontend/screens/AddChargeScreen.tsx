import { AntDesign } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { default as Lottie, default as LottieView } from "lottie-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  useWindowDimensions,
} from "react-native";
import AddItems from "../components/addChargeScreen/AddItems";
import EditItems from "../components/addChargeScreen/EditItems";
import Logo from "../components/details/Logo";
import { Orders } from "../interfaces/Orders";

export default function AddChargeScreen({ navigation, route }: any) {
  const { source, VenmoUserName } = route.params;
  const [orderItems, setOrderItems] = useState<Orders[]>([]);
  const [gratuity, setGratuity] = useState<number>(0);
  const [gratuityPicker, setGratuityPicker] = useState<boolean>(false);
  const [tax, setTax] = useState<number>(0);
  const [taxPicker, setTaxPicker] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const gratuitySheetRef = useRef<BottomSheet>(null);
  const taxSheetRef = useRef<BottomSheet>(null);
  const itemEditSheetRef = useRef<BottomSheet>(null);
  const addItemSheetRef = useRef<BottomSheet>(null);
  const animate = useRef<Lottie>(null);

  async function processImage() {
    const endpoint = "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict";
    const headers = {
      //     Authorization: "Token 3eb14b2677e44a63b7ba915b2dc97768",
      //       Authorization: "Token 97fb73e975e5da28213d00534e59863b",

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
        if (temp.price !== null && temp.price !== 0) {
          res.push(temp);
        }
      }

      setOrderItems(
        res.flatMap((item) => {
          const { itemName, quantity, price } = item;
          const pricePerItem = price / quantity;
          return Array.from({ length: quantity }, () => ({
            itemName,
            price: pricePerItem,
          }));
        })
      );

      let taxRes = 0;
      for (let i = 0; i < response.data.document.inference.pages[0].prediction.taxes.length; i++) {
        taxRes += response.data.document.inference.pages[0].prediction.taxes[i].value;
      }

      setTax(taxRes);
      if (isNaN(taxRes)) {
        setTax(0);
      }

      if (res.length === 0) {
        Alert.alert("No Items Found", "Please manually enter the items.");
      }

      setFinalPrice((totalPrice + tax) * (1 + gratuity));
    } catch (error) {
      console.log("Failed");
    }
    setLoading(false);
  }

  function pickGratuity() {
    const pickerItems = [];
    for (let i = 0; i <= 100; i++) {
      pickerItems.push(<Picker.Item key={i} label={i.toString() + "%"} value={i} />);
    }
    return (
      <Picker
        selectedValue={gratuity * 100}
        onValueChange={(itemValue) => setGratuity(itemValue / 100)}
      >
        {pickerItems}
      </Picker>
    );
  }

  function pickTax() {
    const pickerItems = [];
    for (let i = 0; i <= 100; i++) {
      pickerItems.push(<Picker.Item key={i} label={i.toString() + "%"} value={i} />);
    }
    return (
      <Picker
        selectedValue={parseFloat(((tax / totalPrice) * 100).toFixed(0))}
        onValueChange={(itemValue: any) => {
          setTax(parseFloat(totalPrice * (itemValue / 100) + ""));
        }}
      >
        {pickerItems}
      </Picker>
    );
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
  }, [orderItems, editingItem]);

  useEffect(() => {
    setFinalPrice((totalPrice + tax) * (1 + gratuity));
    if (orderItems.length === 0) {
      setTax(0);
    }
  }, [gratuity, tax, totalPrice, editingItem]);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} />,
    []
  );

  return (
    <View className="flex-1 bg-background-color">
      {loading ? (
        <>
          <Logo />
          <View className="items-center justify-center h-3/5">
            <Text className="my-10 text-xl font-bold text-center text-Black-color">
              Processing Your Receipt...
            </Text>
            <LottieView
              autoPlay
              ref={animate}
              style={{
                width: width,
                height: width * 0.5,
              }}
              loop={true}
              source={require("../assets/loading.json")}
            />
          </View>
        </>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            addItemSheetRef.current?.close();
            gratuitySheetRef.current?.close();
            taxSheetRef.current?.close();
            itemEditSheetRef.current?.close();
          }}
        >
          <View className="w-full h-full ">
            <Logo />
            <View className="flex-row self-center justify-between w-4/5 mt-6 bg-background-color">
              <Text className="text-2xl font-black text-Black-color">
                Orders |{" "}
                <Text className="text-sm font-semibold">Total items: {orderItems.length}</Text>
              </Text>
              <Pressable
                onPress={() => addItemSheetRef.current?.expand()}
                className="justify-center"
              >
                <AntDesign name="pluscircle" size={24} color="black" />
              </Pressable>
            </View>
            <View className="w-5/6 h-0.5 self-center mt-2 bg-Black-color" />
            <View className="mt-2 h-[35%]">
              <ScrollView className="px-10 gap-y-2">
                <View className="">
                  {orderItems.map((item: any, i: number) => (
                    <Pressable
                      className="flex-row items-center justify-between my-2"
                      onPress={() => {
                        setEditingItem(i);
                        itemEditSheetRef.current?.expand();
                      }}
                      key={i}
                    >
                      <Text className="w-48 font-semibold text-Black-color text-md">
                        {item.itemName}
                      </Text>
                      <View className="flex-row p-2 bg-Primary-color/70">
                        <Text className="font-black text-Black-color text-md ">
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
            </View>
            <View className="w-5/6 h-0.5 self-center  bg-Black-color" />
            <View className="px-12 mt-10">
              <View className="flex-row items-center justify-between ">
                <Text className="text-xl font-black text-black ">Total Due</Text>
                <Text className="text-xl font-black text-black ">${finalPrice.toFixed(2)}</Text>
              </View>
              <View className="mt-6">
                <View className="flex-row items-center justify-between">
                  <Text className="w-24 font-black text-black">SubTotal</Text>
                  <Text className="text-xl text-black">${totalPrice.toFixed(2)}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    taxSheetRef.current?.expand();
                  }}
                  className="flex-row items-center justify-between"
                >
                  <Text className="font-black text-black">
                    Tax{" "}
                    {`(${
                      isNaN((tax / totalPrice) * 100)
                        ? "0.0"
                        : ((tax / totalPrice) * 100).toFixed(1)
                    }%)`}
                    <AntDesign name="edit" size={16} color="red" />
                  </Text>
                  <Text className="text-xl text-black">${`${tax.toFixed(2)}`}</Text>
                </Pressable>
                <Pressable
                  onPress={() => gratuitySheetRef.current?.expand()}
                  className="flex-row items-center justify-between"
                >
                  <Text className="font-black text-black ">
                    Gratuity {`(${Math.round(gratuity * 100).toFixed(1)}%)`}
                    <AntDesign name="edit" size={16} color="red" />
                  </Text>

                  <Text className="text-xl text-blacks">
                    ${((totalPrice + tax) * gratuity).toFixed(2)}
                  </Text>
                </Pressable>
                <Text className="self-center my-3 italic text-black/30">
                  *Price may vary due to rounding
                </Text>
              </View>

              <TouchableOpacity
                className="p-3 text-4xl font-black bg-green-400 rounded-2xl"
                onPress={
                  orderItems.length === 0
                    ? () => Alert.alert("Error", "You must have at least one order items.")
                    : () => {
                        navigation.navigate("Contacts", {
                          orderItems: orderItems,
                          source: source,
                          Gratuity: gratuity,
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
            <BottomSheet
              snapPoints={["35%"]}
              backdropComponent={renderBackdrop}
              animationConfigs={animationConfigs}
              index={-1}
              enablePanDownToClose={true}
              ref={gratuitySheetRef}
            >
              <BottomSheetView>
                <View className="flex-row justify-between w-full px-5">
                  <Text className="relative text-xl font-black text-blue-black">
                    Total Gratuity : ${((totalPrice + tax) * gratuity).toFixed(2)}
                  </Text>
                  <Pressable onPress={() => gratuitySheetRef.current?.close()}>
                    <View>
                      <Text className="text-xl font-black">Done</Text>
                    </View>
                  </Pressable>
                </View>
                {pickGratuity()}
              </BottomSheetView>
            </BottomSheet>
            <BottomSheet
              snapPoints={["35%"]}
              backdropComponent={renderBackdrop}
              animationConfigs={animationConfigs}
              index={-1}
              enablePanDownToClose={true}
              ref={taxSheetRef}
            >
              <BottomSheetView>
                <View className="flex-row justify-between w-full px-5 ">
                  <View className="flex-row">
                    <Text className="relative text-xl font-black text-blue-black">
                      Total Tax : $ {tax.toFixed(2)}
                    </Text>
                  </View>

                  <Pressable onPress={() => taxSheetRef.current?.close()}>
                    <View>
                      <Text className="text-xl font-black">Done</Text>
                    </View>
                  </Pressable>
                </View>
                {pickTax()}
              </BottomSheetView>
            </BottomSheet>
            <BottomSheet
              snapPoints={["35%"]}
              backdropComponent={renderBackdrop}
              animationConfigs={animationConfigs}
              index={-1}
              enablePanDownToClose={true}
              ref={addItemSheetRef}
              onClose={() => {
                addItemSheetRef.current?.close();
              }}
            >
              <BottomSheetView>
                <AddItems
                  setOrderItems={setOrderItems}
                  orderItems={orderItems}
                  ref={addItemSheetRef}
                />
              </BottomSheetView>
            </BottomSheet>

            <BottomSheet
              snapPoints={["35%"]}
              backdropComponent={renderBackdrop}
              animationConfigs={animationConfigs}
              index={-1}
              enablePanDownToClose={true}
              ref={itemEditSheetRef}
              onClose={() => {
                itemEditSheetRef.current?.close();
              }}
            >
              <BottomSheetView>
                <EditItems
                  orderItems={orderItems}
                  setOrderItems={setOrderItems}
                  setEditingItem={setEditingItem}
                  currItem={orderItems[editingItem]}
                  index={editingItem}
                  ref={itemEditSheetRef}
                />
              </BottomSheetView>
            </BottomSheet>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
