import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Logo from "../details/Logo";

export default function Welcome() {
  const animation = useRef(null);

  return (
    <View>
      <Logo />
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#eee",
        }}
        source={require("./assets/scanReceipt.json")}
      />
      <Text>Let's get started!</Text>
    </View>
  );
}
