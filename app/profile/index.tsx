import fetchData from "@/utils/fetchData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchUserInfo = async () => {
    try {
      const userInfo: any = await fetchData.getUserInfo();
      setUsername(userInfo.username)
      setEmail(userInfo.email)
      setPhoneNumber(userInfo.phoneNumber)
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchUserInfo()
  }, []))

  const handleLogout = () => {
    AsyncStorage.removeItem('authToken')
    router.push('/login');
  }

  return (
    <>
      <View className="mt-10 bg-green-400 pb-10">
        <Text className="mt-5 text-3xl self-center font-semibold text-white">
          Profile
        </Text>
        <Image
          source={require("../../assets/images/user_avatar.png")}
          className="h-12 w-12 m-4 self-center"
          style={{ height: 200, width: 200 }}
        />
      </View>
      <ScrollView className="mt-5">
        <View style={styles.textField}>
          <Text style={{...styles.text}}>Username: </Text>
          <Text style={{...styles.text, ...styles.textColor}}>{username}</Text>
        </View>
        <View style={styles.textField}>
          <Text style={{...styles.text}}>Email: </Text>
          <Text style={{...styles.text, ...styles.textColor}}>{email}</Text>
        </View>
        <View style={styles.textField}>
          <Text style={{...styles.text}}>Phone number: </Text>
          <Text style={{...styles.text, ...styles.textColor}}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
            <View style={styles.logout}>
                <Text className="text-2xl text-white m-2 font-semibold">Log out</Text>
            </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    textField: {
        width: '80%',
        borderWidth: 3,
        borderColor: '#34E0A1',
        borderRadius: 20,
        alignSelf: 'center',
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    text: {
        fontSize: 20,
        justifyContent: 'center',
        padding: 10,
        paddingRight: 0,
    },

    textColor: {
        color: '#34E0A1',
        fontWeight: '500',
    },

    logout: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: '50%',
        borderRadius: 20,
        marginTop: 30
    }
})

export default ProfileScreen;
