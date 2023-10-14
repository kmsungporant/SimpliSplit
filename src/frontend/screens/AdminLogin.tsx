import { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Logo from "../components/details/Logo";

export default function AdminLogin({ navigation }: any) {
  const [adminId, setAdminId] = useState<string>("");
  const [invalidId, setInvalidId] = useState<boolean>(false);

  function handleSubmit(adminId: String) {
    if (adminId === String(process.env.ADMIN_KEY)) {
      navigation.navigate("LandingPage");
    } else {
      setInvalidId(true);
    }
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaProvider>
        <View className="items-center justify-between flex-1 w-full bg-background-color">
          <Logo />
          <View className="w-3/5 h-3/5 gap-y-5">
            <Text className="text-2xl font-black text-white">Admin ID</Text>
            <TextInput
              placeholder="Admin ID"
              inputMode="text"
              className={`h-12 px-2 text-white border-2 border-gray-600 bg-zinc-700/50 rounded-xl ${
                invalidId ? "border-red-500" : "border-gray-600"
              }`}
              onChangeText={(text) => setAdminId(text)}
              clearButtonMode="always"
              onSubmitEditing={() => handleSubmit(adminId)}
            />
            <TouchableOpacity
              onPress={() => handleSubmit(adminId)}
              className="items-center p-2 border-2 border-Primary-color rounded-3xl"
            >
              <Text className="text-2xl font-bold text-white">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}
