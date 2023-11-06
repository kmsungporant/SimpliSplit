import React from "react";
import { Animated, View, useWindowDimensions } from "react-native";
import { OnboardItems } from "../../interfaces/OnboardingItems";

export default function NavButton({
  currentSlideIndex,
  scrollX,
  slides,
}: {
  currentSlideIndex: number;
  scrollX: any;
  slides: OnboardItems[];
}) {
  const { width } = useWindowDimensions();
  return (
    <View className="justify-between ">
      <View className="flex-row justify-center mt-3">
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            outputRange: [10, 20, 10],
            inputRange,
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              className={`h-2.5 ${
                currentSlideIndex === index ? "bg-white " : "bg-gray-600"
              } rounded-full mx-1`}
              style={[{ width: 5 }, { width: dotWidth }]}
            />
          );
        })}
      </View>
    </View>
  );
}
