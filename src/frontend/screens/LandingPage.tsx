import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { set } from "react-native-reanimated";
import OnboardingItem from "../components/MainScreen/landingPage/OnboardingItem";
import Logo from "../components/details/Logo";
import NavButton from "../components/details/NavButton";

export const slides = [
  {
    id: 1,
    title: "Welcome!",
    animation: require("../assets/Landing.json"),
    description: "A mobile app making spliting bills easier\n Simply Scan, Split, and Settle!",
  },
  {
    id: 2,
    title: "Scan & Confirm",
    animation: require("../assets/Scan.json"),
    description: "Effortlessly scan and digitize your receipts with a simple snap of your camera",
  },
  {
    id: 3,
    title: "Split & Organize",
    animation: require("../assets/Split.json"),
    description: "Organize items efficiently according to each individual's specific order",
  },
  {
    id: 4,
    title: "Settle & Finish",
    animation: require("../assets/Settle.json"),
    description:
      "Effortlessly send payment requests in bulk for the entire group with a single tap, utilizing SMS and Venmo redirects",
  },
];

export default function LandingPage({ navigation }: any) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);
  const [offset, setOffset] = useState(0);
  const [VenmoUserName, setVenmoUserName] = useState<String>("");

  function updateCurrentSlideIndex(e: any) {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setOffset(contentOffsetX);
    setCurrentSlideIndex(currentIndex);
  }

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentSlideIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  function onVenmoPhoneFormat(text: string) {
    var cleaned = ("" + text).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] && "" ,
        number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");

      return number;
    }

    return text;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (slidesRef.current) {
        if (offset === width * 3) {
          slidesRef.current.scrollToOffset({ offset: 0, animated: true });
          setOffset(0);
        } else {
          slidesRef.current.scrollToOffset({ offset: width * 1 + offset, animated: true });
          setOffset(width * 1 + offset);
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [offset]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView className="flex-1 bg-background-color">
        <Logo />
        <View className="flex-row items-end justify-between w-5/6 px-16 mt-8 gap-x-5 bg-background-color">
          <View className="w-full">
            <Text className="text-lg font-black text-white">{"Venmo (Phone #)"}</Text>
            <TextInput
              placeholder="Venmo Username"
              className="h-12 px-2 text-white border-2 border-gray-600 bg-zinc-700/50 rounded-xl "
              onChangeText={(text) => setVenmoUserName(text)}
              clearButtonMode="always"
              value={VenmoUserName == undefined ? "" : onVenmoPhoneFormat(VenmoUserName.toString())}
              keyboardAppearance="dark"
              autoComplete="off"
              keyboardType="number-pad"
              clearTextOnFocus={true}
            />
          </View>
          <TouchableOpacity
            className="h-12 p-3 border-2 border-Primary-color bg-teal rounded-xl"
            onPress={() => {
              if (VenmoUserName.replace(/[^0-9]/g, "").length == 10) {
                navigation.navigate("Camera", { VenmoUserName: VenmoUserName });
              } else {
                Alert.alert("Invalid Phone Number!");
              }
            }}
          >
            <AntDesign name="arrowright" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <FlatList
          onMomentumScrollEnd={updateCurrentSlideIndex}
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
          keyExtractor={(item): any => item.id}
        />
        <NavButton currentSlideIndex={currentSlideIndex} scrollX={scrollX} slides={slides} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
