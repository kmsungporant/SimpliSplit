import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { PhoneContact } from "../../interfaces/PhoneContact";

export default function SelectionPills({
  selectedContacts,
  setSelectedContacts,
}: {
  selectedContacts: PhoneContact[];
  setSelectedContacts: any;
}) {
  function handleContactSelect(contact: PhoneContact) {
    setSelectedContacts((prevSelectedContacts: any) => {
      if (prevSelectedContacts.includes(contact)) {
        return prevSelectedContacts.filter((currContact: PhoneContact) => currContact !== contact);
      } else {
        return [...prevSelectedContacts, contact];
      }
    });
  }
  return (
    <View className="">
      <ScrollView horizontal={true} className="my-2 ">
        <View className="flex-row gap-1">
          {selectedContacts.map((contact: any, i: number) => (
            <Pressable
              key={i}
              className="flex-row items-center px-3 py-1 bg-white rounded-full"
              onPress={() => handleContactSelect(contact)}
            >
              <Text className="text-sm font-black">{contact.firstName}</Text>
              <Text className="ml-1 font-black">
                {contact.lastName?.charAt(0)}
                {contact.lastName && "."}
              </Text>
              <Entypo name="circle-with-cross" size={16} color="black" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
