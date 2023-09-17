import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddChargeScreen from "./AddChargeScreen";
import CameraScreen from "./CameraScreen";
import ContactsScreen from "./ContactsScreen";
import LandingPage from "./LandingPage";
import LoginPageScreen from "./LoginPageScreen";
import OrganizeScreen from "./OrganizeScreen";

const Stack = createNativeStackNavigator();

export default function Screens() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPageScreen} />
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="AddCharge" component={AddChargeScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Organize" component={OrganizeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
