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
import Welcome from "../components/MainScreen/Welcome";
import PaypalCard from "../components/PaypalCard";
import SignUp from "../components/SignUp";
import Logo from "../components/details/Logo";
import Login from "../components/login";
import { auth, firebase, firestore } from "../firebase";
import UserData from "../interfaces/UserData";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MainScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signUpMenu, setSignUpMenu] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [openPaypalMenu, setOpenPaypalMenu] = useState<boolean>(false);
  const [paypalInfo, setPaypalInfo] = useState<any>(null);
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
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            uid: userData.UID,
            accessTokenPayPal: userData.accessTokenPayPal,
          });

          if (user?.accessTokenPayPal === undefined) {
            setOpenPaypalMenu(true);
          }

          setUserInfo(userData);
          setFullName(userData?.firstName + " " + userData.lastName);
          setLoadingUser(false);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log("User is signed in.");
        setUser({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          uid: user.UID,
          accessTokenPayPal: user.accessTokenPayPal,
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
    <Welcome />
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     Keyboard.dismiss();
    //   }}
    // >
    //   <View className="items-center justify-center flex-1 w-full bg-black">
    //     {loadingUser ? (
    //       <ActivityIndicator size="large" />
    //     ) : (
    //       <>
    //         <Logo />
    //         {user ? (
    //           <View className="h-1/2">
    //             <View className="flex-col items-center p-12">
    //               <Text className="text-2xl text-white">Welcome back</Text>
    //               <Text className="text-2xl font-black text-white">{fullName}</Text>
    //             </View>
    //             {paypalInfo ? (
    //               <View className="flex flex-col items-center justify-center h-full">
    //                 <TouchableOpacity
    //                   className="items-center w-full px-16 py-3 mb-3 bg-teal rounded-3xl"
    //                   onPress={() => {
    //                     navigation.navigate("Image");
    //                   }}
    //                 >
    //                   <Text className="text-2xl font-bold text-white">Continue</Text>
    //                 </TouchableOpacity>
    //               </View>
    //             ) : null}
    //           </View>
    //         ) : (
    //           <Login
    //             email={email}
    //             password={password}
    //             setEmail={setEmail}
    //             setUser={setUser}
    //             setPassword={setPassword}
    //             setSignUpMenu={setSignUpMenu}
    //             sheetRef={sheetRef}
    //           />
    //         )}
    //         {signUpMenu && (
    //           <BottomSheet
    //             ref={sheetRef}
    //             snapPoints={["95%"]}
    //             enablePanDownToClose={true}
    //             onClose={() => setSignUpMenu(false)}
    //             animationConfigs={animationConfigs}
    //           >
    //             <BottomSheetView className="">
    //               <View className="bg-white rounded-t-3xl">
    //                 <SignUp setSignUpMenu={setSignUpMenu} setUser={setUser} />
    //               </View>
    //             </BottomSheetView>
    //           </BottomSheet>
    //         )}
    //         {paypalInfo ? null : (
    //           <View className="">
    //             <Modal
    //               animationType="slide"
    //               transparent={true}
    //               visible={openPaypalMenu}
    //               onRequestClose={() => setOpenPaypalMenu(false)}
    //             >
    //               <View
    //                 style={{ height: SCREEN_HEIGHT * 0.2 }}
    //                 className="absolute bottom-0 left-0 right-0 z-10 items-center justify-start bg-white rounded-t-3xl drop-shadow-xl"
    //               >
    //                 <PaypalCard
    //                   setOpenPaypalMenu={setOpenPaypalMenu}
    //                   setPaypalInfo={setPaypalInfo}
    //                 />
    //               </View>
    //             </Modal>
    //           </View>
    //         )}
    //       </>
    //     )}
    //   </View>
    // </TouchableWithoutFeedback>
  );
}
