import { Fontisto } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import { createContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { set } from "react-native-reanimated";
import OrderItems from "../components/OrganizeScreen/OrderItems";
import Profile from "../components/OrganizeScreen/Profile";
import Logo from "../components/details/Logo";
import NavButton from "../components/details/NavButton";
import { firebase } from "../firebase";

export default function OrganizeScreen({ navigation, route }: any) {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;

  const { contacts, source, orderItems, Gratuity, tax, finalPrice, subTotal, user } = route.params;
  const [currPage, setCurrPage] = useState<number>(0);
  const [finalOrderItems, setFinalOrderItems] = useState<any>(orderItems);
  const [finalJson, setFinalJson] = useState<any>(
    contacts.map((contact: any) => ({
      ...contact,
      itemsOrdered: [],
    }))
  );

  function handlePress(index: number, newItem: any) {
    setFinalJson((prev: any) => {
      const newJson = [...prev];
      newJson[currPage].itemsOrdered.push(newItem);
      return newJson;
    });
    setFinalOrderItems((prev: any) => {
      const newOrderItems = [...prev];
      newOrderItems.splice(index, 1);
      return newOrderItems;
    });
  }
  function resetItems() {
    setFinalJson(
      contacts.map((contact: any) => ({
        ...contact,
        itemsOrdered: [],
      }))
    );
    setFinalOrderItems(orderItems);
  }

  async function sendSMS(): Promise<void> {
    const phoneNumbers: any[] = [];
    let resultString = "\n\n";
    const isAvailable: boolean = await SMS.isAvailableAsync();
    resultString += `SubTotal: $${subTotal}\n`;
    resultString += `Tax (${tax}): $${(subTotal * tax).toFixed(2)}\n`;
    resultString += `Gratuity (${Gratuity}): $${(subTotal * (1 + tax) * Gratuity).toFixed(2)}\n`;
    resultString += `Total Due: ${finalPrice.toFixed(2)}\n\n`;
    resultString += `--------------------------\n\n`;

    if (finalJson.length !== 0 && finalJson) {
      finalJson.map((contact: any) => {
        phoneNumbers.push(contact.phoneNumbers[0].number);
      });

      finalJson.map((contact: any) => {
        let total = 0;
        resultString += `Name: ${contact.name}\n\n`;
        resultString += `Items Ordered: \n`;
        contact.itemsOrdered.map((item: any) => {
          resultString += `${item.itemName} - $${item.price}\n`;
          total += item.price;
        });
        resultString += `\n`;
        resultString += `Subtotal: $${total.toFixed(2)}\n`;
        resultString += `Tax (${tax}): $${(total * tax).toFixed(2)}\n`;
        resultString += `Gratuity (${Gratuity}): $${(total * (1 + tax) * Gratuity).toFixed(2)}\n`;
        resultString += `Total: $${(total * (1 + tax) * (1 + Gratuity)).toFixed(2)}\n\n`;
        resultString += `https://venmo.com/${user.username}?txn=pay&note=SimpliSplit&amount=${(
          total *
          (1 + tax) *
          (1 + Gratuity)
        ).toFixed(2)}`;
        resultString += `\n--------------------------\n\n`;
      });
    }

    if (isAvailable) {
      try {
        const { result }: any = await SMS.sendSMSAsync(phoneNumbers, resultString, {
          attachments: {
            uri: source,
            mimeType: "image/jpeg",
            filename: "Receipt.jpg",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    navigation.navigate("LandingPage", { user: user });
  }
  function updateCurrentSlideIndex(e: any) {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrPage(currentIndex);
  }

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrPage(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <SafeAreaView className="flex-1 w-full bg-background-color">
      <Logo />
      <View
        className={`${
          finalOrderItems.length === 0 ? "h-2/3" : "h-1/3"
        } items-center justify-center mt-10 `}
      >
        <FlatList
          onMomentumScrollEnd={updateCurrentSlideIndex}
          data={finalJson}
          renderItem={({ item }: any) => <Profile contact={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={32}
          keyExtractor={(item): any => item.id}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
        />
        <NavButton slides={finalJson} currentSlideIndex={currPage} scrollX={scrollX} />
      </View>
      {finalOrderItems.length !== 0 && (
        <View className="mt-3 h-1/3">
          <FlatList
            data={finalOrderItems}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() => handlePress(item.index, item.item)}
                className="items-center m-3 bg-gray-700 rounded-xl"
              >
                <OrderItems item={item.item} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View className="flex-row items-center self-center gap-2 p-4 ">
        <TouchableOpacity
          className="items-center justify-center w-1/5 p-4 bg-white rounded-xl"
          onPress={resetItems}
        >
          <Fontisto name="redo" size={26} color="black" />
        </TouchableOpacity>
        <View className="w-4/5">
          <Pressable
            className="items-center py-3 bg-green-400 rounded-2xl"
            onPress={() =>
              finalOrderItems.length === 0
                ? sendSMS()
                : Alert.alert("Error", "Please organize all order items to continue.")
            }
          >
            <Text className="text-3xl font-black text-black">Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
