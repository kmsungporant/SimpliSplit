import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Screens from "./screens/Screens";

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Screens />
    </GestureHandlerRootView>
  );
}
