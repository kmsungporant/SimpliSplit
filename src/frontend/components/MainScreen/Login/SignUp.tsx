import firebase from "firebase/compat";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { firestore } from "../../../firebase";

export default function SignUp({ setSignUpMenu, setUser }: any) {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [weakPassword, setWeakPassword] = useState<boolean>(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);

  function handleSignUp() {
    if (email === "" || password === "" || username === "") return;

    if (username.includes(" ")) {
      Alert.alert("Invalid username", "Please enter a username with no spaces.");
      setInvalidUsername(true);
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user !== null) {
          firestore
            .collection("users")
            .doc(user.uid)
            .set({
              uid: user.uid,
              username: username,
              email: email,
            })
            .catch((error) => {
              console.log("Firestore error:", error.message);
            });
          setSignUpMenu(false);
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Email already in use", "Please use a different email.");
          setEmailExists(true);
        } else if (error.code === "auth/weak-password") {
          Alert.alert("Weak password", "Please use a stronger password. (At least 6 characters)");
          setWeakPassword(true);
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Invalid email", "Please use a valid email.");
          setEmailExists(true);
        }
      });
  }
  useEffect(() => {
    if (emailExists) {
      if (email.length === 0) {
        setEmailExists(false);
      }
    }
  }, [email]);

  return (
    <View className="w-full h-full">
      <View className="items-center justify-center py-6">
        <Text className="text-3xl">Create an account</Text>
      </View>
      <View className="w-full px-10">
        <View className="w-full ">
          <Text className={`font-black px-1 ${emailExists ? "text-red-500" : "text-black"}`}>
            Email
          </Text>
          <TextInput
            autoCorrect={false}
            ref={emailRef}
            keyboardType="email-address"
            inputMode="email"
            className={`h-10 px-1 mb-2 text-base ${
              emailExists ? "border-red-500" : "border-black"
            } border-b-2 `}
            onSubmitEditing={() => usernameRef.current?.focus()}
            onChangeText={(text) => setEmail(text)}
            clearButtonMode="always"
          />
        </View>
        <View className="w-full py-5">
          <Text className={`font-black px-1 ${invalidUsername ? "text-red-500" : "text-black"}`}>
            Username (Venmo or Phone #)
          </Text>
          <TextInput
            autoCorrect={false}
            ref={usernameRef}
            keyboardType="default"
            inputMode="text"
            className={`h-10 px-1 mb-2 text-base ${
              invalidUsername ? "border-red-500" : "border-black"
            } border-b-2 `}
            onSubmitEditing={() => passwordRef.current?.focus()}
            onChangeText={(text) => setUsername(text)}
            clearButtonMode="always"
          />
        </View>
        <View className="w-full py-5">
          <View className="flex-row justify-between">
            <Text className={`px-1 font-black ${weakPassword ? "text-red-500" : "text-black"}`}>
              Password
            </Text>
            {password.length > 0 ? (
              <TouchableOpacity
                className="justify-end"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-black">{showPassword ? "Show" : "Hide"}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TextInput
            autoCorrect={false}
            ref={passwordRef}
            secureTextEntry={showPassword}
            className={`h-10 px-1 text-base text-black border-b-2 ${
              weakPassword ? "border-red-500" : "border-black"
            }`}
            onChangeText={(text) => setPassword(text)}
            clearButtonMode="always"
            onSubmitEditing={() => handleSignUp()}
          />
        </View>
        <View className="items-center">
          <TouchableOpacity
            className="items-center px-16 py-3 border-2 border-Primary-color rounded-3xl"
            onPress={handleSignUp}
          >
            <Text className="text-2xl font-bold text-black">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity className="">
            <Text className="text-white underline">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
