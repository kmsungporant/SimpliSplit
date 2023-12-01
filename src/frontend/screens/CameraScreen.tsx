import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../components/details/Logo";

export default function CameraScreen({ navigation, route }: any) {
  const { VenmoUserName } = route.params;
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const { width, height } = Dimensions.get("window");
  let camera: Camera | null;

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied", "Please check your camera permissions and try again.");
    }
  };

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setImage(photo.uri);
    setStartCamera(false);
  };

  useEffect(() => {
    openCamera();
  }, []);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
  };

  const styles = StyleSheet.create({
    box: {
      position: "relative",
      borderColor: "white",
      justifyContent: "center",
      alignSelf: "center",
      width: width * 0.7,
      height: height * 0.65,
    },
  });

  return (
    <View className="items-center flex-1 bg-background-color">
      {image ? (
        <>
          <Image source={{ uri: image }} resizeMode="contain" className="w-full h-full" />
          <SafeAreaView className="absolute items-center justify-between h-full">
            {/* <Logo /> */}
            <View style={styles.box}></View>
            <View className="flex-row justify-between gap-x-5 ">
              <Pressable
                className="items-center px-12 py-2 mb-3 bg-gray-600 rounded-xl"
                onPress={() => {
                  setImage("");
                  setStartCamera(true);
                }}
              >
                <Text className="text-xl font-black text-white ">Retry</Text>
              </Pressable>
              <Pressable
                className="items-center px-12 py-2 mb-3 bg-Primary-color rounded-xl "
                onPress={() =>
                  navigation.navigate("AddCharge", { VenmoUserName: VenmoUserName, source: image })
                }
              >
                <Text className="text-xl font-black text-white">Confirm</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </>
      ) : startCamera ? (
        <Camera
          className="flex-1 w-full"
          ref={(r) => {
            camera = r;
          }}
          onLayout={handleLayout}
        >
          <SafeAreaView className="items-center justify-between h-full">
            <Text className="text-white/40">
              Please make sure all text is within the outlined area
            </Text>
            <View style={styles.box}>
              <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/40"></View>
              <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/40"></View>
              <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/40"></View>
              <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/40"></View>
            </View>

            <View className="items-center w-4/5 mb-5 ">
              <TouchableOpacity className="items-center w-full" onPress={takePicture}>
                <Ionicons name="radio-button-on" size={75} color="#2d7092" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Camera>
      ) : (
        <SafeAreaView className="items-center justify-between h-full">
          <Logo />
        </SafeAreaView>
      )}
    </View>
  );
}
