import { Fontisto } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import OrderItems from "../components/OrganizeScreen/OrderItems";
import Profile from "../components/OrganizeScreen/Profile";
import Logo from "../components/details/Logo";
import NavButton from "../components/details/NavButton";

export default function OrganizeScreen({ navigation, route }: any) {
  const { contacts, source, orderItems, Gratuity, tax, finalPrice, subTotal, VenmoUserName } =
    route.params;
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;

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
          renderItem={({ item }: any) => (
            <Profile
              contactIndex={currPage}
              contact={item}
              setFinalJson={setFinalJson}
              setFinalOrderItems={setFinalOrderItems}
            />
          )}
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
                className="items-center m-3 bg-Black-color rounded-xl"
              >
                <OrderItems item={item.item} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View className="flex-row items-center self-center gap-2 p-4 ">
        <TouchableOpacity
          className="items-center justify-center w-1/5 p-4 bg-Primary-color rounded-xl"
          onPress={resetItems}
        >
          <Fontisto name="redo" size={20} color="white" />
        </TouchableOpacity>
        <View className="w-4/5">
          <Pressable
            className="items-center py-3 bg-Primary-color rounded-2xl"
            onPress={() =>
              finalOrderItems.length === 0
                ? navigation.navigate("SendSMS", {
                    source: source,
                    Gratuity: Gratuity,
                    tax: tax,
                    finalPrice: finalPrice,
                    subTotal: subTotal,
                    VenmoUserName: VenmoUserName,
                    finalJson: finalJson,
                  })
                : Alert.alert("Error", "Please organize all order items to continue.")
            }
          >
            <Text className="text-lg font-black text-center text-white">Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
