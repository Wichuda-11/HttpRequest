import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Button } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";

const baseUrl = 'http://reqres.in';
//const baseUrl = " http://localhost:3000";

const Stack = createNativeStackNavigator();

//แบบที่1
//axios.get(`${baseUrl}/api/users/1`).then((response) => {
//console.log(response.data)
//});

//แบบที่2 async
//const fetchUser = async() =>{
//const url = `${baseUrl}/api/users/1`;
//const response = await axios.get(url)
//console.log(response.data)
//}
//fetchUser()

//**ยิง api Requests พร้อมกันหลายตัว
//const concurrentRequests = [
//axios.get(`${baseUrl}/api/users/1`),
// axios.get(`${baseUrl}/api/users/2`),
//axios.get(`${baseUrl}/api/users/3`),
//];

//**using Promise.all
//Promise.all(concurrentRequests)
//.then((result) => {
//console.log(result)
//})
//.catch((err) =>{
// console.log(err)
//})

//สร้าง Network Requests
//const axiosInstance = axios.create({baseURL: 'http://reqres.in/'});
//เรียกใช้ method get
//axiosInstance.get('api/users/1').then(response => {
//console.log(response.data);
//});

function User({userObject}) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={{ uri: userObject.avatar }}
        style={{ width: 128, height: 128, borderRadius: 64 }}
      />
      <Text>{`ID: ${userObject.id} ${userObject.first_name} ${userObject.last_Name}`}</Text>
    </View>
  );
}

//Get
function HomeScreen({navigation}){
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setErrorFlag] = useState(false);

  const changeUserIdHandler = () => {
    setUserId((userId) => (userId === 10 ? 1 : userId + 1));
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const url = `${baseUrl}/api/users/${userId}`;
    //const url = `${baseUrl}/users`;
    const fetchUsers = async () => {
      const response = await axios.get(url, { cancelToken: source.token });
      try {
        setIsLoading(true);
        //const response = await axios.get(url, { cancelToken: source.token });

        if (response.status === 200) {
          setUser(response.data.data);
          setIsLoading(false);
          return;
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Data fetching cancelled");
        } else {
          setErrorFlag(true);
          setIsLoading(false);
        }
      }
    };
    fetchUsers();
    return () => source.cancel("Data fetching cancelled");
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.text1}> Get Request</Text>
      </View>

      <View style={styles.wrapperStyle}>
        {!isLoading && !hasError && user && <User userObject={user} />}
      </View>
      <View style={styles.wrapperStyle}>
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && hasError && <Text>An error has occurred</Text>}
      </View>
      <View>
        <View style={styles.buttonStyle}>
          <Button
            title="Load user"
            onPress={changeUserIdHandler}
            disabled={isLoading}
            buttonStyle={styles.styledButton2}
            titleStyle={styles.buttontitle}
          />
        </View>
        <View style={styles.buttonStyle}>
          <Button
            title="Go to Post Request Page"
            onPress={() => navigation.navigate("Post")}
            buttonStyle={styles.styledButton2}
            titleStyle={styles.buttontitle}
          />
        </View>
        <View style={styles.buttonStyle}>
          <Button
            title="Go to Put Request Page"
            onPress={() => navigation.navigate("Put")}
            buttonStyle={styles.styledButton2}
            titleStyle={styles.buttontitle}
          />
        </View>
        <View style={styles.buttonStyle}>
          <Button
            title="Go to Delete Request Page"
            onPress={() => navigation.navigate("Delete")}
            buttonStyle={styles.styledButton2}
            titleStyle={styles.buttontitle}
          />
        </View>
      </View>
    </ScrollView>
  );
}

//หลัก
export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home Page" }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ title: "Post Page" }}
        />
        <Stack.Screen
          name="Put"
          component={Put}
          options={{ title: "Put Page" }}
        />
        <Stack.Screen
          name="Delete"
          component={Delete}
          options={{ title: "Delete Page" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//Post
function Post () {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeNameHandler = (fullname) => {
    setFullName(fullname);
  };

  const onChangeEmailHandler = (email) => {
    setEmail(email);
  };

  const onSubmitFormHandler = async (event) => {
    if (!fullName.trim() || !email.trim()) {
      alert("Name or Email is invalid");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/users`, {
        fullName,
        email,
      });
      if (response.status === 201) {
        alert(` You have created: ${JSON.stringify(response.data)}`);
        setIsLoading(false);
        setFullName("");
        setEmail("");
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("An error has occurred");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      <View>
        <Text style={styles.text1}> Post Request</Text>
      </View>

      <View>
        <View style={styles.wrapper}>
          {isLoading ? (
            <Text> Creating resource </Text>
          ) : (
            <Text> Create new user </Text>
          )}
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="FullName"
            placeholderTextColor="#333"
            value={fullName}
            editable={!isLoading}
            onChangeText={onChangeNameHandler}
            style={styles.input}
          />
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#333"
            value={email}
            editable={!isLoading}
            onChangeText={onChangeEmailHandler}
            style={styles.input}
          />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Submit"
          onPress={onSubmitFormHandler}
          disabled={isLoading}
          buttonStyle={styles.styledButton2}
          titleStyle={styles.buttontitle}
        />
      </View>
    </ScrollView>
  );
}


//Put
function Put () {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const onChangeNameHandler = (fullname) => {
    setFullName(fullname);
  };

  const onChangeEmailHandler = (email) => {
    setEmail(email);
  };

  const onChangeIdHandler = (id) => {
    setUserId(id);
  };

  const onSubmitFormHandler = async (event) => {
    if (!fullName.trim() || !email.trim() || !userId.trim()) {
      alert("Name or Email or UserId is invalid");
      return;
    }
    setIsLoading(true);


    const configurationObject = {
      url: `${baseUrl}/api/users/${userId}`,
      method: "PUT",
      data: { fullName, email },
    };


    axios(configurationObject)
      .then((response) => {
        if (response.status === 200) {
          alert(` You have updated: ${JSON.stringify(response.data)}`);
          setIsLoading(false);
          setFullName("");
          setEmail("");
        } else {
          throw new Error("An error has occurred");
        }
      })
      .catch((error) => {
        alert("An error has occurred");
        setIsLoading(false);
      });
  
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.text1}> Put Request</Text>
      </View>

      <View>
        <View style={styles.wrapper}>
          {isLoading ? (
            <Text> Updating resource </Text>
          ) : (
            <Text> updated user </Text>
          )}
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="User ID"
            placeholderTextColor="#333"
            value={userId}
            editable={!isLoading}
            onChangeText={onChangeIdHandler}
            style={styles.input}
          />
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="FullName"
            placeholderTextColor="#333"
            value={fullName}
            editable={!isLoading}
            onChangeText={onChangeNameHandler}
            style={styles.input}
          />
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#333"
            value={email}
            editable={!isLoading}
            onChangeText={onChangeEmailHandler}
            style={styles.input}
          />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Submit"
          onPress={onSubmitFormHandler}
          disabled={isLoading}
          buttonStyle={styles.styledButton2}
          titleStyle={styles.buttontitle}
        />
      </View>
    </ScrollView>
  );
}


//Delete
function Delete() {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const onChangeIdHandler = (id) => {
    setUserId(id);
  };

  const onSubmitFormHandler = async (event) => {
    if (!userId.trim()) {
      alert("UserId is invalid");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.delete(`${baseUrl}/api/users/${userId}`);
      if (response.status === 204) {
        alert(`You have deleted: ${JSON.stringify(response.data)}`);
        setIsLoading(false);
        setUserId(null)
      } else {
        throw new Error("Failed to delete resource");
      }
    } catch (error) {
      alert("Failed to delete resource");
      setIsLoading(false);
    }
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.text1}> Delete Request</Text>
      </View>

      <View>
        <View style={styles.wrapper}>
          {isLoading ? (
            <Text> Deleting resource </Text>
          ) : (
            <Text> Deleted user </Text>
          )}
        </View>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="User ID"
            placeholderTextColor="#333"
            value={userId}
            editable={!isLoading}
            onChangeText={onChangeIdHandler}
            style={styles.input}
          />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Submit"
          onPress={onSubmitFormHandler}
          disabled={isLoading}
          buttonStyle={styles.styledButton2}
          titleStyle={styles.buttontitle}
        />
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",

    //marginTop: Platform.OS==='ios' ? 0 : Constants.statusBarHeight
  },
  wrapperStyle: {
    minHeight: 128,
  },
  wrapper: {
    marginBottom: 10,
  },
  buttonStyle: {
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "grey",
    minWidth: 300,
    textAlignVertical: "center",
    paddingLeft: 10,
    borderRadius: 10,
    height:50,
  },
  text1: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 40,
    color: "black",
  },
  view1: {
    width: 40,
    height: 40,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  styledButton2: {
    backgroundColor: "#af7cf2",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    borWidth: 1,
    bordorColor: "#af7cf2",
    height: 50,
    paddingHorizontal: 10,
    width: "100%",
  },

  buttontitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    marginTop: -3,
  },
});
