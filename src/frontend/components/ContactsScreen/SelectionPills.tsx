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
      <ScrollView horizontal={true} className="my-2" showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-1">
          {selectedContacts.map((contact: any, i: number) => (
            <Pressable
              key={i}
              className="flex-row items-center px-3 py-1 rounded-full bg-Primary-color"
              onPress={() => handleContactSelect(contact)}
            >
              <Text className="text-sm font-black text-white">{contact.firstName}</Text>
              <Text className="ml-1 font-black text-white">
                {contact.lastName?.charAt(0)}
                {contact.lastName && "."}
              </Text>
              <Entypo name="circle-with-cross" size={16} color="white" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
