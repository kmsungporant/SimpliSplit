import { FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import ProfilePic from "../details/profilePic";

export default function Profile({ contactIndex, contact, setFinalJson, setFinalOrderItems }: any) {
  const { width } = useWindowDimensions();

  function removeItem(index: number, item: any) {
    setFinalJson((prev: any) => {
      const newJson = [...prev];
      newJson[contactIndex].itemsOrdered.splice(index, 1);
      return newJson;
    });
    setFinalOrderItems((prev: any) => {
      const newOrderItems = [...prev];
      newOrderItems.push(item);
      return newOrderItems;
    });
  }

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
        <Text className="text-3xl font-black text-Primary-color">
          {contact.firstName} {contact.lastName}
        </Text>
      </View>

      <View className="items-center flex-1 ">
        <FlatList
          data={contact.itemsOrdered}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                className="flex-row justify-between mt-5 space-x-8"
                onPress={() => removeItem(index, item)}
              >
                <View className="justify-center w-52">
                  <Text className="w-48 font-bold text-Black-color">{item.itemName}</Text>
                </View>
                <View className="flex-row p-2 bg-Primary-color">
                  <Text className="font-black text-white text-md ">
                    $
                    {isNaN(item.price) || item.price === 0 ? (0).toFixed(2) : item.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}
