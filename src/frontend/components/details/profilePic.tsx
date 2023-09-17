import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfilePic({
  firstLetter,
  lastLetter,
}: {
  firstLetter: string | undefined;
  lastLetter: string | undefined;
}) {
  const [color, setColor] = useState<string>("");
  useEffect(() => {
    setColor(getRandomLightColor());
  }, []);

  const getRandomLightColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 6) + 9]; // Generate colors in the range of 9 to F
    }
    return color;
  };
  return (
    <View
      className="flex-row items-center justify-center w-10 h-10 mr-3 rounded-full"
      style={{ backgroundColor: color }}
    >
      <Text className="font-black ">{firstLetter}</Text>
      <Text className="font-black">{lastLetter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
