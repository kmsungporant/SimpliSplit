import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import { PhoneContact } from "../../interfaces/PhoneContact";

export default function AddContact({ setAddContactMenu, setSelectedContacts }: any) {
  const [firstName, setFirstName] = useState<String>("");
  const [lastName, setLastName] = useState<String>("");
  const [Phone, setPhone] = useState<String>("");

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setPhone("");
  }, []);

  function onVenmoPhoneFormat(text: string) {
    var cleaned = ("" + text).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] && "",
        number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");

      return number;
    }

    return text;
  }

  return (
    <KeyboardAvoidingView
      className="absolute bottom-0 z-10 w-full bg-white rounded-3xl"
      behavior="padding"
    >
      <Text className="m-5 text-3xl font-black text-blue-black">Add Contact</Text>
      <View className="flex-row items-center justify-between px-5 mt-4">
        <Text className="text-xl font-semibold text-black">Name</Text>
        <TextInput
          className="w-3/5 p-2 bg-gray-100 rounded-2xl"
          placeholder="Enter Name"
          keyboardAppearance="dark"
          autoCorrect={false}
          autoComplete="off"
          clearButtonMode="always"
          autoCapitalize="sentences"
          placeholderTextColor={"#18181b"}
          onChangeText={(text) => {
            const nameArray = text.split(" ");
            if (nameArray.length > 1) {
              setFirstName(nameArray[0]);
              setLastName(nameArray[1]);
            } else {
              setFirstName(nameArray[0]);
            }
          }}
        />
      </View>
      <View className="flex-row items-center justify-between px-5 mt-4">
        <Text className="text-xl font-semibold text-black">Phone #</Text>
        <TextInput
          placeholder="Enter Phone Number"
          className="w-3/5 p-2 bg-gray-100 rounded-2xl"
          onChangeText={(text) => setPhone(text)}
          clearButtonMode="always"
          placeholderTextColor={"#18181b"}
          value={Phone == undefined ? "" : onVenmoPhoneFormat(Phone.toString())}
          keyboardAppearance="dark"
          autoComplete="off"
          keyboardType="number-pad"
          clearTextOnFocus={true}
          maxLength={11}
        />
      </View>
      <View className="flex-row justify-between px-3 py-5 ">
        <Pressable
          onPress={() => setAddContactMenu(false)}
          className="items-center px-12 py-4 mb-3 bg-Primary-color border-Primary-color rounded-xl"
        >
          <Text className="text-xl font-black">Cancel</Text>
        </Pressable>
        <Pressable
          className="px-12 py-4 mb-3 bg-green-400 border-black rounded-xl"
          onPress={() => {
            const newContact = {
              id: null,
              firstName: firstName,
              lastName: lastName,
              phoneNumbers: [{ number: Phone }],
              image: null,
              imageAvailable: false,
              recordID: null,
            };
            if (newContact.phoneNumbers[0].number.length === 10) {
              setSelectedContacts((prev: PhoneContact[]) => [...prev, newContact]);
              setAddContactMenu(false);
            } else {
              Alert.alert("Please Enter Phone Number");
            }
          }}
        >
          <Text className="w-20 text-xl font-black text-center">Add</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
