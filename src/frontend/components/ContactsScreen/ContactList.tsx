import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { PhoneContact } from "../../interfaces/PhoneContact";
import ProfilePic from "../details/profilePic";

export default function ContactList({
  contact,
  setSelectedContacts,
  selectedContacts,
}: {
  contact: PhoneContact;
  setSelectedContacts: any;
  selectedContacts: PhoneContact[];
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
      <Pressable
        onPress={() => {
          handleContactSelect(contact);
        }}
        className=""
      >
        <View className="flex-row items-center justify-between py-3 rounded-xl">
          <View className="flex-col w-full mx-3">
            <View className="flex-row items-center">
              {contact.imageAvailable ? (
                <Image
                  source={{ uri: contact.image.uri }}
                  className="w-10 h-10 mr-3 rounded-full"
                />
              ) : (
                <ProfilePic
                  firstLetter={contact.firstName?.charAt(0)}
                  lastLetter={contact.lastName?.charAt(0)}
                />
              )}
              <Text className="text-2xl text-white">
                <Text className="font-black">{contact.firstName}</Text> {contact.lastName}
              </Text>
              <View className="ml-5 ">
                {selectedContacts.includes(contact) && (
                  <AntDesign name="check" size={24} color="#1F6E8C" />
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
