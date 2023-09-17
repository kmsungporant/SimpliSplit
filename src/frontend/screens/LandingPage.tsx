import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { default as Lottie, default as LottieView } from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
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

export default function LandingPage({ navigation, route }: any) {
  const { user } = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);
  const [offset, setOffset] = useState(0);
  const [finalScreen, setFinalScreen] = useState(false);

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
      <NavButton currentSlideIndex={currentSlideIndex} scrollX={scrollX} slides={slides} />
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
      <View className="justify-center w-3/5 ">
        <TouchableOpacity
          className="items-center py-3 mb-10 border-2 border-Primary-color bg-teal rounded-3xl"
          onPress={() => {
            navigation.navigate("Camera", { user: user });
          }}
        >
          <Text className="text-2xl font-bold text-white">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
