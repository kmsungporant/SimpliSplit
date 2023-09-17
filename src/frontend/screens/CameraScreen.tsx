// import { GOOGLE_CLOUD_VISION_API_KEY } from "@env";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/details/Logo";
import { firebase } from "../firebase";
import { Orders } from "../interfaces/Orders";

export default function CameraScreen({ navigation, route }: any) {
  const { user } = route.params;
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);
  const absoluteBoxRef = useRef(null);
  const [confirmPage, setConfirmPage] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const { width, height } = Dimensions.get("window");
  let camera: Camera | null;

  async function UploadImage(imageUpload: any) {
    const response = await fetch(imageUpload);
    const blob = await response.blob();
    const fileName = imageUpload.substring(imageUpload.lastIndexOf("/") + 1);
    const storageRef = firebase.storage().ref().child(fileName);

    try {
      const snapshot = await storageRef.put(blob);
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
      setCameraLoading(false);
    } else {
      Alert.alert("Access denied", "Please check your camera permissions and try again.");
    }
  };

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setImage(photo.uri);
    setStartCamera(false);
    setConfirmPage(true);
  };

  useEffect(() => {
    openCamera();
  }, []);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
  };

  

  // async function processImage() {
  //   try {
  //     const imageUri = image;
  //     const base64Image = await convertImageToBase64(imageUri);
  //     const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCEs68Ejuzo6nYrRLIX5sH9PMaxkv_tuAc`, {
  //       requests: [
  //         {
  //           image: { content: base64Image },
  //           features: [{ type: "TEXT_DETECTION" }],
  //         },
  //       ],
  //     });
  //     const textAnnotations = response.data.responses[0].textAnnotations;
  //     const text = textAnnotations[0].description;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const convertImageToBase64 = async (imageUri: string) => {
  //   try {
  //     const response = await FileSystem.readAsStringAsync(imageUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     return response;
  //   } catch (error) {
  //     console.error("Error converting image to Base64:", error);
  //     throw error;
  //   }
  // };

  const styles = StyleSheet.create({
    box: {
      position: "relative",
      borderColor: "white",
      justifyContent: "center",
      alignSelf: "center",
      width: width * 0.7,
      height: height * 0.5,
    },
  });

  return (
    <View className="items-center flex-1 bg-background-color">
      {image ? (
        <>
          <Image source={{ uri: image }} resizeMode="contain" className="w-full h-full" />
          <SafeAreaView className="absolute items-center justify-between h-full">
            <Logo />
            <View style={styles.box}></View>
            <View className="flex-row justify-between gap-x-5 ">
              <Pressable
                className="items-center px-12 py-2 mb-3 bg-Primary-color border-Primary-color rounded-xl"
                onPress={() => {
                  setImage("");
                }}
              >
                <Text className="text-xl font-black text-white ">Retry</Text>
              </Pressable>
              <Pressable
                className="items-center px-12 py-2 mb-3 bg-green-400 border-black rounded-xl "
                onPress={() => navigation.navigate("AddCharge", { user: user, source: image })}
              >
                <Text className="text-xl font-black text-white">Confirm</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </>
      ) : (
        <Camera
          className="flex-1 w-full"
          ref={(r) => {
            camera = r;
          }}
          onLayout={handleLayout}
        >
          <SafeAreaView className="items-center justify-between h-full">
            <Logo />
            <View style={styles.box}>
              <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-background-color/40"></View>
              <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-background-color/40"></View>
              <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-background-color/40"></View>
              <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-background-color/40"></View>
            </View>

            <View className="items-center w-4/5 mb-10">
              <TouchableOpacity
                className="items-center w-full py-3 mb-10 border-2 border-Primary-color bg-background-color/40 rounded-3xl"
                onPress={takePicture}
              >
                <Text className="text-2xl font-black text-white ">Scan</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Camera>
      )}
    </View>
  );
}
