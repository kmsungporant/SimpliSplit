import * as Contacts from "expo-contacts";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContactList from "../components/ContactsScreen/ContactList";
import SelectionPills from "../components/ContactsScreen/SelectionPills";
import Search from "../components/details/Search";
import { PhoneContact } from "../interfaces/PhoneContact";

export default function ContactsScreen({ navigation, route }: any) {
  const { orderItems, source, tax, Gratuity, finalPrice, subTotal, user } = route.params;
  const [contacts, setContacts] = useState<any>([]);
  const [searchText, setSearchText] = useState<String>("");
  const [selectedContacts, setSelectedContacts] = useState<PhoneContact[]>([]);

  useEffect(() => {
    getContacts();
    Alert.alert("Note", "Contacts that don't have a phone number will not be displayed.");
  }, []);

  async function getContacts() {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Image,
          Contacts.Fields.ImageAvailable,
        ],
      });

      if (data.length > 0) {
        data.sort((a: any, b: any) => {
          const firstNameA = a.firstName?.toUpperCase();
          const firstNameB = b.firstName?.toUpperCase();
          if (firstNameA < firstNameB) {
            return -1;
          }
          if (firstNameA > firstNameB) {
            return 1;
          }
          return 0;
        });
        setContacts(data);
      }
    }
  }

  let filteredContacts = contacts.filter(
    (contact: any) =>
      ((contact.firstName && contact.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
        (contact.lastName && contact.lastName.toLowerCase().includes(searchText.toLowerCase()))) &&
      contact.phoneNumbers &&
      contact.phoneNumbers.length > 0
  );

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <View className="h-full px-3">
        <Text className="text-4xl font-black text-white"> Contacts</Text>
        <Search setSearchText={setSearchText} />
        <SelectionPills
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
        />

        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactList
              contact={item}
              setSelectedContacts={setSelectedContacts}
              selectedContacts={selectedContacts}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-700 w-[93%] self-center" />}
          className=""
          keyExtractor={(item) => item.id}
        />

        <View
          className={`absolute bottom-0 z-50 items-center self-center w-full ${
            selectedContacts.length === 0 && "-z-50"
          }`}
        >
          {selectedContacts.length > 0 && (
            <Pressable
              className={`items-center py-3 rounded-2xl bg-green-300 w-full   ${
                selectedContacts.length === 0 && "bg-aqua-blue/10 "
              }`}
              onPress={() => {
                selectedContacts.length === 0
                  ? Alert.alert("Error", "Select at least one contact to continue.")
                  : navigation.navigate("Organize", {
                      orderItems: orderItems,
                      contacts: selectedContacts,
                      source: source,
                      Gratuity: Gratuity,
                      tax: tax,
                      finalPrice: finalPrice,
                      subTotal: subTotal,
                      user: user,
                    });
              }}
            >
              <Text className="text-3xl font-black text-black">Continue</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
