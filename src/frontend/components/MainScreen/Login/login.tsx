import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "firebase/compat";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login({
  email,
  password,
  setEmail,
  setUser,
  setPassword,
  setSignUpMenu,
  sheetRef,
}: any) {
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [forgotPasswordToggle, setForgotPasswordToggle] = useState<boolean>(false);
  const passwordRef = useRef<TextInput>(null);
  function handleSubmit() {
    if (invalidEmail) {
      setInvalidEmail(true);
    } else if (invalidPassword) {
      setInvalidPassword(true);
    } else {
      if (forgotPasswordToggle) {
        handleForgotPassword(email);
      } else {
        handleSignIn();
      }
    }
  }
  function handleForgotPassword(email: string) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Password reset email sent", "Please check your email to reset your password.");
        setForgotPasswordToggle(false);
      })
      .catch((error) => {
        setInvalidEmail(true);
      });
  }

  async function handleSignIn() {
    if (email === "" || password === "") return;
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user !== null) {
          setUser(user);
        }
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          Alert.alert("User not found", "Please check your email and password.");
          setInvalidEmail(true);
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Invalid email", "Please check your email.");
          setInvalidEmail(true);
        } else if (error.code === "auth/wrong-password") {
          Alert.alert("Wrong password", "Please Check your password.");
          setInvalidPassword(true);
        }
      });
  }

  useEffect(() => {
    if (invalidEmail) {
      if (email.length === 0) {
        setInvalidEmail(false);
      }
    }
  }, [email]);

  useEffect(() => {
    if (invalidPassword) {
      if (password.length === 0) {
        setInvalidPassword(false);
      }
    }
  }, [password]);

  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
    setSignUpMenu(true);
  }, []);

  return (
    <View className="justify-center w-full px-10 h-3/5">
      <View className="w-full py-5">
        <Text className={`px-1 mb-2 text-lg ${invalidEmail ? "text-red-500" : "text-white"}`}>
          Email
        </Text>
        <TextInput
          keyboardType="email-address"
          inputMode="email"
          className={`h-12 px-2   text-white bg-zinc-700/50 rounded-xl border-2 border-gray-600  ${
            invalidEmail && "border-red-500 "
          }`}
          onChangeText={(text) => setEmail(text)}
          clearButtonMode="always"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
      </View>
      {forgotPasswordToggle ? null : (
        <View className="w-full py-3">
          <View className="flex-row justify-between">
            <Text
              className={`px-1 text-lg mb-2 ${invalidPassword ? "text-red-500" : "text-white"}`}
            >
              Password
            </Text>
            {password.length > 0 ? (
              <TouchableOpacity
                className="justify-end mb-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className={`${invalidPassword ? "text-red-500" : "text-white"}`}>
                  {showPassword ? "Show" : "Hide"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TextInput
            ref={passwordRef}
            onSubmitEditing={handleSubmit}
            secureTextEntry={showPassword}
            className={`h-12 px-2   text-white bg-zinc-700/50 rounded-xl border-2 border-gray-600 ${
              invalidEmail && "border-red-500 "
            }`}
            onChangeText={(text) => setPassword(text)}
            clearButtonMode="always"
          />
        </View>
      )}

      <View className="items-center">
        <View className="h-16">
          {invalidPassword ? (
            <View className="justify-center py-2">
              <Text className="text-red-500">Invalid Password</Text>
            </View>
          ) : null}
          {invalidEmail ? (
            <View className="justify-center py-2">
              <Text className="text-red-500">Invalid Email</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          className="items-center w-3/5 py-3 mb-3 border-2 border-Primary-color rounded-3xl"
          onPress={handleSubmit}
        >
          <Text className="text-2xl font-bold text-white">
            {forgotPasswordToggle ? "Submit" : "Sign In"}
          </Text>
        </TouchableOpacity>

        {forgotPasswordToggle ? (
          <TouchableOpacity
            className="items-center w-3/5 px-16 py-3 bg-teal rounded-3xl"
            onPress={() => setForgotPasswordToggle(false)}
          >
            <Text className="text-2xl font-bold text-white">back</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity className="my-3" onPress={() => setForgotPasswordToggle(true)}>
              <Text className="text-white underline">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity className="" onPress={() => handleSnapPress()}>
              <Text className="text-white">Create an account</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
