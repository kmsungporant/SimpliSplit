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
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
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
  const [gratuityPercentage, setGratuityPercentage] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [indexOfLoading, setIndexOfLoading] = useState(0);
  const { width } = useWindowDimensions();
  const gratuitySheetRef = useRef<BottomSheet>(null);
  const taxSheetRef = useRef<BottomSheet>(null);
  const itemEditSheetRef = useRef<BottomSheet>(null);
  const addItemSheetRef = useRef<BottomSheet>(null);
  const animate = useRef<Lottie>(null);
  const texts = [
    ["Processing Your Receipt...", "Please hold on, we're carefully scanning each detail."],
    [
      "Experiencing a slow connection...",
      "Don't worry, we're still actively processing your receipt. This may take a bit longer than usual.",
    ],
  ];

  async function processImage() {
    let price = 0;
    const endpoint = "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict";
    const headers = {
      //       Authorization: "Token 3eb14b2677e44a63b7ba915b2dc97768",
      Authorization: "Token 97fb73e975e5da28213d00534e59863b",
      "Content-Type": "multipart/form-data",
    };

    let data = new FormData();
    data.append("document", { uri: source, name: "receipt.jpg", type: "image/jpeg" });

    try {
      setInterval(() => {
        setIndexOfLoading(1);
      }, 10000);
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
          price += temp.price;
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

      if (isNaN(taxRes)) {
        setTax(0);
      } else {
        setTax(taxRes);
      }
      setTaxPercentage(parseFloat(((taxRes / price) * 100).toFixed(0)));

      if (res.length === 0) {
        Alert.alert("No Items Found", "Please manually enter the items.");
      }
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
        selectedValue={gratuityPercentage}
        onValueChange={(itemValue) => {
          setGratuityPercentage(itemValue);
        }}
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
        selectedValue={taxPercentage}
        onValueChange={(itemValue: any) => {
          setTaxPercentage(itemValue);
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
    const subPrice = parseFloat(
      orderItems
        .reduce((acc: number, curr: any) => {
          return acc + curr.price;
        }, 0)
        .toFixed(2)
    );
    const taxTotal = subPrice * (taxPercentage / 100);
    const gratuityTotal = (taxTotal + subPrice) * (gratuityPercentage / 100);
    const totalOfAll = taxTotal + gratuityTotal + subPrice;

    setTotalPrice(subPrice);
    setFinalPrice(totalOfAll);
    if (subPrice === 0) {
      setTax(0);
      setGratuity(0);
    } else {
      setTax(taxTotal);
      setGratuity(gratuityTotal);
    }
  }, [orderItems, gratuityPercentage, taxPercentage]);

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
        <View className="w-full h-full mt-8">
          <Logo />
          <View className="items-center justify-center h-4/5">
            <Text className=" text-lg font-black text-center text-Primary-color w-4/5">
              {texts[indexOfLoading][0]}
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
            <Text className="w-3/5 text-center h-24"> {texts[indexOfLoading][1]}</Text>
          </View>
        </View>
      ) : (
        <View className="w-full h-full mt-8">
          <Logo />
          <View className="flex-row justify-between mx-8 mt-6 bg-background-color">
            <Text className="text-2xl font-black text-Black-color">
              Orders |{" "}
              <Text className="text-sm font-semibold">Total items: {orderItems.length}</Text>
            </Text>
            <Pressable onPress={() => addItemSheetRef.current?.expand()} className="justify-center">
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
                      <Text className="font-black text-white text-md ">
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
          <View className="px-8 mt-10">
            <View className="flex-row items-center justify-between ">
              <Text className="text-xl font-black text-Black-color ">Total Due</Text>
              <Text className="text-xl font-black text-Black-color ">${finalPrice.toFixed(2)}</Text>
            </View>
            <View className="mt-6">
              <View className="flex-row items-center justify-between">
                <Text className="w-24 font-black text-Black-color">SubTotal</Text>
                <Text className="text-xl text-Black-color">${totalPrice.toFixed(2)}</Text>
              </View>
              <Pressable
                onPress={() => {
                  taxSheetRef.current?.expand();
                }}
                className="flex-row items-center justify-between"
              >
                <Text className="font-black text-Black-color">
                  Tax {`(${taxPercentage}%)`}
                  <AntDesign name="edit" size={16} color="red" />
                </Text>
                <Text className="text-xl text-Black-color">${`${tax.toFixed(2)}`}</Text>
              </Pressable>
              <Pressable
                onPress={() => gratuitySheetRef.current?.expand()}
                className="flex-row items-center justify-between"
              >
                <Text className="font-black text-Black-color ">
                  Gratuity {`(${gratuityPercentage}%)`}
                  <AntDesign name="edit" size={16} color="red" />
                </Text>

                <Text className="text-xl text-Black-color">${gratuity.toFixed(2)}</Text>
              </Pressable>
              <Text className="self-center my-3 italic text-Black-color/30">
                *Price may vary due to rounding
              </Text>
            </View>

            <TouchableOpacity
              className="p-3 text-4xl font-black bg-Primary-color rounded-2xl"
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
              <Text className="text-lg font-black text-center text-white">Validate</Text>
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
                  Total Gratuity : ${gratuity.toFixed(2)}
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
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                addItemSheetRef.current?.collapse();
              }}
            >
              <BottomSheetView>
                <AddItems
                  setOrderItems={setOrderItems}
                  orderItems={orderItems}
                  ref={addItemSheetRef}
                />
              </BottomSheetView>
            </TouchableWithoutFeedback>
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
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                itemEditSheetRef.current?.collapse();
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
            </TouchableWithoutFeedback>
          </BottomSheet>
        </View>
      )}
    </View>
  );
}
