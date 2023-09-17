import { default as Lottie, default as LottieView } from "lottie-react-native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardItems } from "../../../interfaces/OnboardingItems";

export default function OnboardingItem({ item }: { item: OnboardItems }) {
  const { width } = useWindowDimensions();
  const animate = useRef<Lottie>(null);

  return (
    <SafeAreaView className="items-center " style={{ width }}>
      <LottieView
        autoPlay
        ref={animate}
        style={{
          width: width,
          height: width * 0.7,
        }}
        loop={true}
        source={item.animation}
      />
      <View className="items-center w-full space-y-5">
        <Text className="text-3xl font-black text-center text-Primary-color ">{item.title}</Text>
        <Text className="w-4/5 text-lg font-semibold text-center text-white">
          {item.description}
        </Text>
      </View>
    </SafeAreaView>
  );
}
