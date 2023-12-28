import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddChargeScreen from "./AddChargeScreen";
import CameraScreen from "./CameraScreen";
import ContactsScreen from "./ContactsScreen";
import LandingPage from "./LandingPage";
import OrganizeScreen from "./OrganizeScreen";
import SendSMSScreen from "./SendSMSScreen";

const Stack = createNativeStackNavigator();

export default function Screens() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="AddCharge" component={AddChargeScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Organize" component={OrganizeScreen} />
        <Stack.Screen name="SendSMS" component={SendSMSScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
