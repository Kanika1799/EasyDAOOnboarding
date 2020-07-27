import * as React from "react";
import { Image, View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Headline,
  Subheading,
  Paragraph,
  Button,
  TextInput,
} from "react-native-paper";
import EmailWhite from "../assets/images/EmailWhite.png";
// import Web3 from "web3";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-community/async-storage";
import { m, Web3 } from "../App";

export default function Email({ navigation }) {
  const [text, setText] = React.useState("");
  const [showMagic, setShowMagic] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(false);

  const showLink = async () => {
    console.log("Clicked");
    console.log("Authenticating");
    console.log("text", text);
    try {
      await m.auth.loginWithMagicLink({ email: text });
      setShowLoader(true);
      const web3 = new Web3(m.rpcProvider); // Or window.web3 = ...
      console.log(web3);
      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];
      console.log("address", address);

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address) // Balance is in wei
      );
      try {
        console.log("setting storgae", text);
        await AsyncStorage.setItem("user_email", text);
        await AsyncStorage.setItem("user_ethaddress", address);
        navigation.replace("Organization");
      } catch (e) {
        console.log("error", e);
      }
    } catch (e) {
      console.log("Error", e);
    }
    console.log("Authenticating12");
  };

  return (
    <View style={styles.container}>
      <m.Relayer />
      <View style={styles.container}>
        <Image
          source={EmailWhite}
          style={{ width: 100, height: 130, marginTop: 125 }}
        />
        <Headline style={{ color: "white", marginTop: 35, fontSize: 30 }}>
          Enter Your Email
        </Headline>
        <TextInput
          style={{
            marginTop: 35,
            width: 300,
            backgroundColor: "white",
            height: 50,
            borderRadius: 10,
            borderBottomColor: "white",
            borderColor: "white",
            alignContent: "center",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          label="Email"
          type="outlined"
          value={text}
          onChangeText={(text) => setText(text)}
        />

        {showLoader ? (
          <ActivityIndicator style={{ marginTop: 50 }} />
        ) : (
          <Button
            mode="contained"
            style={{ marginTop: 50, backgroundColor: "#0099ff", width: 120 }}
            onPress={() => setShowMagic(false)}
            onPress={showLink}
            // onPress={() => navigation.push("EmailLink")}
          >
            Send Link
          </Button>
        )}

        <Subheading style={{ marginTop: 45, color: "white" }}>
          Already have a Etherum account?
        </Subheading>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(40, 51, 76)",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    width: 130,
    marginLeft: 120,
    borderRadius: 25,
    marginBottom: 25,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});
