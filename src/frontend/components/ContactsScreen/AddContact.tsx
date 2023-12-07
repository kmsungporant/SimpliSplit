import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { PhoneContact } from "../../interfaces/PhoneContact";

const AddContact = forwardRef(
  (
    {
      setAddContactMenu,
      setSelectedContacts,
    }: { setAddContactMenu: any; setSelectedContacts: any },
    ref: any
  ) => {
    const [firstName, setFirstName] = useState<String>("");
    const [lastName, setLastName] = useState<String>("");
    const [Phone, setPhone] = useState<String>("");

    function handleSubmit() {
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
        setFirstName("");
        setLastName("");
        setPhone("");
        Keyboard.dismiss();
        ref.current.close();
      } else {
        Alert.alert("Invalid Phone Number", "Please enter a valid phone number");
      }
    }

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
      <View className="z-50 w-full">
        <Text className="mx-5 text-3xl font-black text-blue-black">Add Contact</Text>
        <View className="flex-row items-center justify-between px-5 mt-4">
          <Text className="text-xl font-semibold text-black">Name</Text>
          <BottomSheetTextInput
            style={{
              width: "60%",
              padding: 8,
              backgroundColor: "#F3F4F6",
              borderRadius: 16,
            }}
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
          <BottomSheetTextInput
            placeholder="Enter Phone Number"
            style={{
              width: "60%",
              padding: 8,
              backgroundColor: "#F3F4F6",
              borderRadius: 16,
            }}
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
            onPress={() => {
              ref.current?.close();
              Keyboard.dismiss();
            }}
            className="items-center px-12 py-4 mb-3 bg-Black-color rounded-xl"
          >
            <Text className="text-xl font-black text-white">Cancel</Text>
          </Pressable>
          <Pressable
            className="px-12 py-4 mb-3 border-black bg-Primary-color rounded-xl"
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text className="w-20 text-xl font-black text-center text-white">Add</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

export default AddContact;
