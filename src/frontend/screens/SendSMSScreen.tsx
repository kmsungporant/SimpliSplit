import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/details/Logo";
import ProfilePic from "../components/details/profilePic";

const devInfo = [
  {
    Icon: <AntDesign name="github" size={30} />,
    text: "Github",
    link: "https://github.com/kmsungporant/SimpliSplit",
  },
  {
    Icon: <AntDesign name="earth" size={30} />,
    text: "Website",
    link: "https://www.simplisplit.com",
  },
  {
    Icon: <Entypo name="app-store" size={30} />,
    text: "App Store",
    link: "https://testflight.apple.com/join/0oryhdQ4",
  },
];

export default function SendSMSScreen({ navigation, route }: any) {
  const {
    source,
    Gratuity,
    tax,
    finalPrice,
    subTotal,
    VenmoUserName,
    finalJson,
    preTax,
    discount,
  } = route.params;
  const taxPercent = (tax / subTotal) * 100;
  const gratuityPercent = (Gratuity / (subTotal + tax)) * 100;

  async function sendInvoice(): Promise<void> {
    const phoneNumbers: any[] = [];
    let resultString = "\n\n";
    const isAvailable: boolean = await SMS.isAvailableAsync();

    resultString += `SubTotal: $${subTotal}\n`;
    resultString += `Tax (${isNaN(taxPercent) ? "0" : taxPercent.toFixed(0)}%): $${tax.toFixed(
      2
    )}\n`;

    resultString += `Gratuity (${gratuityPercent}%): $${Gratuity.toFixed(2)}\n`;
    resultString += `Total Due: $${finalPrice.toFixed(2)}\n\n`;
    resultString += `--------------------------\n\n`;

    if (finalJson.length !== 0 && finalJson) {
      finalJson.map((contact: any) => {
        phoneNumbers.push(contact.phoneNumbers[0].number);
      });

      finalJson.map((contact: any) => {
        let total = 0;
        let taxTotal = 0;
        let gratuityTotal = 0;
        resultString += `Name: ${
          contact.firstName + " " + (contact.lastName ? contact.lastName : "")
        }\n\n`;
        resultString += `Items Ordered: \n`;
        contact.itemsOrdered.map((item: any) => {
          resultString += `${item.itemName} - $${item.price.toFixed(2)}\n`;
          total += item.price;
        });
        taxTotal = (taxPercent / 100) * total;
        gratuityTotal = (gratuityPercent / 100) * (total + taxTotal);
        resultString += `\n`;
        resultString += `Subtotal: $${total.toFixed(2)}\n`;
        resultString += `Tax (${
          isNaN(taxPercent) ? "0" : taxPercent.toFixed(0)
        }%): $${taxTotal.toFixed(2)}\n`;
        resultString += `Gratuity (${gratuityPercent}%): $${gratuityTotal.toFixed(2)}\n`;
        resultString += `Total: $${(total + taxTotal + gratuityTotal).toFixed(2)}\n\n`;

        resultString += `\n--------------------------\n\n`;
      });

      resultString += "Powered By SimpliSplit.\n\n";
    }

    if (isAvailable) {
      try {
        const { result }: any = await SMS.sendSMSAsync(phoneNumbers, resultString, {
          attachments: {
            uri: source,
            mimeType: "image/jpeg",
            filename: "Receipt.jpg",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function sendToIndividual(contact: any): Promise<void> {
    let total = 0;
    let taxTotal = 0;
    let gratuityTotal = 0;

    contact.itemsOrdered.map((item: any) => {
      total += item.price;
    });
    taxTotal = (taxPercent / 100) * total;
    let subPriceWithDiscount = total - (isNaN(discount) ? 0 : discount);

    if (preTax) {
      gratuityTotal = subPriceWithDiscount * (gratuityPercent / 100);
    } else {
      gratuityTotal = (taxTotal + subPriceWithDiscount) * (gratuityPercent / 100);
    }

    (total + taxTotal + gratuityTotal).toFixed(2);

    Linking.openURL(
      `https://venmo.com/?txn=charge&audience=private&recipients=${
        contact.phoneNumbers[0].digits
      }&amount=${(total + taxTotal + gratuityTotal).toFixed(2)}`
    );
  }
  return (
    <SafeAreaView className="flex-1 w-full bg-background-color">
      <Logo />
      <FlatList
        data={finalJson}
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between p-3 rounded-xl">
            <View className="flex-row items-center">
              {item.imageAvailable ? (
                <Image source={{ uri: item.image.uri }} className="w-10 h-10 mr-3 rounded-full" />
              ) : (
                <ProfilePic
                  firstLetter={item.firstName?.charAt(0)}
                  lastLetter={item.lastName?.charAt(0)}
                />
              )}
              <Text className="text-xl font-black text-Primary-color">
                {item.firstName} {item.lastName}
              </Text>
            </View>
            <TouchableOpacity className="mr-3" onPress={() => sendToIndividual(item)}>
              <FontAwesome name="send" size={30} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-px bg-Black-color w-[93%] self-center" />}
        className="mt-5"
      />
      <TouchableOpacity
        onPress={() => sendInvoice()}
        className="flex-row items-center justify-center py-2 mx-10 mt-2 rounded-2xl bg-Primary-color"
      >
        <View className="px-2">
          <FontAwesome name="send" size={30} />
        </View>
        <Text className="text-lg font-black text-center text-black">Send Invoice</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center mt-3"
        onPress={() => navigation.navigate("LandingPage")}
      >
        <Text className="text-xl">Back to Home</Text>
      </TouchableOpacity>

      <View className="items-center mt-5 h-1/4">
        <View className="items-center justify-center ">
          {devInfo.map((info, key) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(info.link)}
              className="flex-row items-center justify-center"
              key={key}
            >
              <View className="p-2">{info.Icon}</View>
              <Text className="text-xl font-black text-Black-color">{info.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="py-2">
          Developed & Designed by{" "}
          <Text
            onPress={() => Linking.openURL("https://www.linkedin.com/in/kmsungporant/")}
            className="text-Primary-color"
          >
            Minsung Kim
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
