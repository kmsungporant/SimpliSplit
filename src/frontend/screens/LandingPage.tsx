import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
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
    <SafeAreaView className="items-center flex-1 bg-background-color">
      <Logo />
      <View className="w-3/5 mt-5">
        <Text className="text-lg font-black text-white">Venmo Username</Text>
        <TextInput
          placeholder="Venmo Username"
          inputMode="text"
          className="h-10 px-2 text-white border-2 border-gray-600 bg-zinc-700/50 rounded-xl "
          onChangeText={(text) => setVenmoUserName(text)}
          clearButtonMode="always"
          value={VenmoUserName == undefined ? "" : VenmoUserName.toString()}
          onSubmitEditing={() => navigation.navigate("Camera", { VenmoUserName: VenmoUserName })}
        />
        <TouchableOpacity
          className="items-center py-2 mt-5 border-2 border-Primary-color bg-teal rounded-3xl"
          onPress={() => {
            navigation.navigate("Camera", { VenmoUserName: VenmoUserName });
          }}
        >
          <Text className="text-2xl font-bold text-white">Get Started</Text>
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
  );
}
