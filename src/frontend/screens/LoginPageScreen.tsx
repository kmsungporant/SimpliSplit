import BottomSheet, { BottomSheetView, useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SignUp from "../components/MainScreen/Login/SignUp";
import Login from "../components/MainScreen/Login/login";
import Logo from "../components/details/Logo";
import ProfilePic from "../components/details/profilePic";
import { auth, firebase, firestore } from "../firebase";
import UserData from "../interfaces/UserData";

export default function LoginPageScreen({ navigation }: any) {
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signUpMenu, setSignUpMenu] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [color, setColor] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [image, setImage] = useState<String>();
  const sheetRef = useRef<BottomSheet>(null);

  function getUserInfo(UID: string) {
    firestore
      .collection("users")
      .doc(UID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData: any = doc.data();
          setUser({
            email: userData.email,
            uid: userData.UID,
            username: userData.username,
          });

          setUserInfo(userData);
          setLoadingUser(false);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const getRandomLightColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 6) + 9]; // Generate colors in the range of 9 to F
    }
    return color;
  };

  useEffect(() => {
    setColor(getRandomLightColor());
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log("User is signed in.");
        setUser({
          email: user.email,
          uid: user.uid,
          username: user.username,
        });
        setLoadingUser(true);
        getUserInfo(user.uid);
      } else {
        setLoadingUser(false);
      }
    });
  }, []);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaProvider>
        <View className="items-center flex-1 w-full bg-background-color">
          {loadingUser ? (
            <View className="justify-center h-full">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              <Logo />
              {user ? (
                <View className="flex-col items-center justify-center gap-16 h-[70%] ">
                  <View className="items-center gap-4">
                    <View
                      className="flex-row items-center justify-center w-48 h-48 rounded-full skew mb-9"
                      style={{ backgroundColor: color }}
                    >
                      <Text className="text-5xl font-black">{user.username?.charAt(0)}</Text>
                    </View>
                    <Text className="text-4xl text-white">Welcome back,</Text>
                    <Text className="text-4xl font-black text-white">{user.username}</Text>
                  </View>

                  <TouchableOpacity
                    className="px-16 py-3 border-2 border-Primary-color bg-teal rounded-3xl"
                    onPress={() => {
                      navigation.navigate("LandingPage", { user: userInfo });
                    }}
                  >
                    <Text className="text-2xl font-bold text-white">Continue</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Login
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setUser={setUser}
                  setPassword={setPassword}
                  setSignUpMenu={setSignUpMenu}
                  sheetRef={sheetRef}
                />
              )}
              {signUpMenu && (
                <BottomSheet
                  ref={sheetRef}
                  snapPoints={["95%"]}
                  enablePanDownToClose={true}
                  onClose={() => setSignUpMenu(false)}
                  animationConfigs={animationConfigs}
                >
                  <BottomSheetView className="">
                    <View className="bg-white rounded-t-3xl">
                      <SignUp setSignUpMenu={setSignUpMenu} setuser={setUser} />
                    </View>
                  </BottomSheetView>
                </BottomSheet>
              )}
            </>
          )}
        </View>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}
