import { AntDesign } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import * as Contacts from "expo-contacts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AddContact from "../components/ContactsScreen/AddContact";
import ContactList from "../components/ContactsScreen/ContactList";
import SelectionPills from "../components/ContactsScreen/SelectionPills";
import AddItems from "../components/addChargeScreen/AddItems";
import Search from "../components/details/Search";
import { PhoneContact } from "../interfaces/PhoneContact";
export default function ContactsScreen({ navigation, route }: any) {
  const { orderItems, source, tax, Gratuity, finalPrice, subTotal, VenmoUserName } = route.params;
  const [contacts, setContacts] = useState<any>([]);
  const [searchText, setSearchText] = useState<String>("");
  const [addContactMenu, setAddContactMenu] = useState<Boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<PhoneContact[]>([]);
  const contactSheetRef = useRef<BottomSheet>(null);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} />,
    []
  );
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  useEffect(() => {
    getContacts();
  }, []);

  function findUser(contacts: any, VenmoUserName: String) {
    let found = false;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length > 0) {
        const phoneNumber = contacts[i].phoneNumbers[0];

        let cleanedPhoneNumber = phoneNumber.digits;
        if (phoneNumber.digits.startsWith("+1")) {
          cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
        }

        if (cleanedPhoneNumber === VenmoUserName) {
          const user: PhoneContact = {
            id: contacts[i].id,
            firstName: contacts[i].firstName.trim(),
            lastName: contacts[i].lastName,
            phoneNumbers: contacts[i].phoneNumbers,
            image: contacts[i].image,
            imageAvailable: contacts[i].imageAvailable,
            recordID: contacts[i].recordID,
          };
          setSelectedContacts([user]);
          found = true;
          return;
        }
      }
    }

    if (!found) {
      Alert.alert(
        "Select Your Name",
        "Your Phone number associated with your Venmo account was not found in the list."
      );
    }

    return null;
  }

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
        findUser(data, VenmoUserName);
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
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View className="h-full px-3">
          <View className="flex-row justify-between">
            <Text className="text-4xl font-black text-Black-color">Contacts</Text>
            <Pressable
              onPress={() => {
                contactSheetRef.current?.expand();
              }}
            >
              <AntDesign name="pluscircle" size={30} color="#2d7092" />
            </Pressable>
          </View>
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
            ItemSeparatorComponent={() => (
              <View className="h-px bg-Black-color w-[93%] self-center" />
            )}
            keyExtractor={(item) => item.id}
          />

          <View
            className={`absolute bottom-0 z-50 items-center self-center w-full ${
              selectedContacts.length === 0 && "-z-50"
            }`}
          >
            {selectedContacts.length > 0 && (
              <Pressable
                className="items-center w-full py-3 rounded-2xl bg-Primary-color "
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
                        VenmoUserName: VenmoUserName,
                      });
                }}
              >
                <Text className="text-lg font-black text-center text-white">Continue</Text>
              </Pressable>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <BottomSheet
        snapPoints={["35%"]}
        backdropComponent={renderBackdrop}
        animationConfigs={animationConfigs}
        index={-1}
        enablePanDownToClose={true}
        ref={contactSheetRef}
        onClose={() => {
          contactSheetRef.current?.close();
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            contactSheetRef.current?.collapse();
          }}
        >
          <BottomSheetView>
            <AddContact
              setAddContactMenu={setAddContactMenu}
              setSelectedContacts={setSelectedContacts}
              ref={contactSheetRef}
            />
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </SafeAreaView>
  );
}
