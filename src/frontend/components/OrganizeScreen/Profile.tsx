import { FlatList, Image, Text, View, useWindowDimensions } from "react-native";
import ProfilePic from "../details/profilePic";

export default function Profile({ contact }: { contact: any }) {
  const { width } = useWindowDimensions();

  return (
    <View className="items-center" style={{ width }}>
      <View className="flex-row">
        {contact.imageAvailable ? (
          <Image source={{ uri: contact.image.uri }} className="w-10 h-10 mr-3 rounded-full" />
        ) : (
          <ProfilePic
            firstLetter={contact.firstName?.charAt(0)}
            lastLetter={contact.lastName?.charAt(0)}
          />
        )}
        <Text className="text-3xl font-black text-white">{contact.name}</Text>
      </View>

      <View className="items-center ">
        <FlatList
          data={contact.itemsOrdered}
          renderItem={({ item }) => {
            return (
              <View className="flex-row justify-between mt-5 space-x-32">
                <View className="flex-row gap-2">
                  <Text className="font-bold text-white ">{item.itemName}</Text>
                </View>

                <Text className="text-white">${item.price}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
