import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/auth";
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import Header from "../../components/Header";

//components
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import RegularText from "../../components/text/RegularText";
import { colours } from "../../components/ColourPalette";
import axios from "axios";
const { primary, white, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

export default function SignIn() {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [step, setStep] = useState("personal-information");
  const { signIn } = useAuth();

  const handleContinue = () => {
    setStep("your-profile");
  };

  const handleSignup = async (credentials) => {
    console.log(
      "Calling auth with username: " +
        credentials.username +
        " and password: " +
        credentials.password
    );
    try {
      const userData = {
        username: credentials.username,
        password: credentials.password,
        email: credentials.email,
        contactNumber: credentials.phoneNumber,
        displayName: credentials.displayName,
      };
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/user/signUp`,
        userData
      );

      console.log(response.data);

      if (response.status === 200) {
        console.log("User successfully signed up");
        router.push("/sign-in");
      } else {
        //shouldnt come here
        console.log("User sign up unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Error during sign up: ", error.message);
      }
    }
  };

  return (
    <SafeAreaContainer>
      <Header title="Create Account" />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              phoneNumber: "",
              username: "",
              displayName: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (
                values.email == "" ||
                values.password == "" ||
                values.username == "" ||
                values.confirmPassword == "" ||
                values.phoneNumber == "" ||
                values.username == "" ||
                values.displayName == ""
              ) {
                setMessage("Please fill in all fields");
                setIsSuccessMessage(false);
              } else if (values.password !== values.confirmPassword) {
                setMessage("Passwords do not match");
                setIsSuccessMessage(false);
              } else if (values.password.length < 6) {
                setMessage("Password must be at least 6 characters long");
                setIsSuccessMessage(false);
              } else if (values.phoneNumber.length != 8) {
                setMessage("Phone number must be 8 numbers long");
                setIsSuccessMessage(false);
              } else {
                handleSignup(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <StyledTextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                />
                <StyledTextInput
                  placeholder="Password"
                  secureTextEntry
                  isPassword={true}
                  value={values.password}
                  onChangeText={handleChange("password")}
                />
                <StyledTextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  isPassword={true}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                />
                <StyledTextInput
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  value={values.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                />
                <StyledTextInput
                  placeholder="Username"
                  value={values.username}
                  onChangeText={handleChange("username")}
                />
                <StyledTextInput
                  placeholder="Display Name"
                  value={values.displayName}
                  onChangeText={handleChange("displayName")}
                />
                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
                  {message || " "}
                </MessageBox>
                <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                >
                  Create My Account
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.bottomContainer}>
        <RegularText typography="B2">
          Already have an account?{" "}
          <Link href="/sign-in">
            <Text style={{ color: primary, textDecorationLine: "underline" }}>
              Log in
            </Text>
          </Link>
        </RegularText>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    top: 40,
    flexGrow: 1,
    alignItems: "center",
  },
  bottomContainer: {
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
  },
});
