import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
  <Tabs
    screenOptions={{
        tabBarActiveTintColor:"#0C2736",
        headerStyle:{
            backgroundColor:"#FFFCF9",
            alignContent: "center",
            justifyContent: 'center'
        },
        headerShadowVisible: false,
        headerTintColor:"#000000",
        tabBarStyle: {
            backgroundColor:"#FFFCF9"
        }
    }}
  >
    <Tabs.Screen 
      name="home" 
      options={{
        title: "Home",
        headerTitle: "Travel Mate",
        headerShown: false,
        tabBarIcon: ({focused, color}) => <Ionicons name="home-outline" size={24} color={color}/>
        }}/>
    <Tabs.Screen 
      name="search" 
      options={{
        title: "Search",
        headerShown: false,
        headerTitle: "Search",
        tabBarIcon: ({focused, color}) => <Ionicons name="search-outline" size={24} color={color}/>
        }}/>
    <Tabs.Screen
      name="03-create-tour"
      options={{
        title: "Create",
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Ionicons name="add-circle" size={34} color={color} />
        ),
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" }, // Paryškintas tekstas
      }}
    />

     <Tabs.Screen 
      name="saved" 
      options={{
        title: "Saved",
        headerShown: false,
        headerTitle: "Saved",
        tabBarIcon: ({focused, color}) => <Ionicons name="bookmark-outline" size={24} color={color}/>
        }}/>
    <Tabs.Screen 
      name="05-profile" 
      options={{
        title: "Profile",
        headerShown: false,
        headerTitle: "Profile",
        tabBarIcon: ({focused, color}) => <Ionicons name="person-outline" size={24} color={color}/>
        }}/>
  </Tabs>
  );
}