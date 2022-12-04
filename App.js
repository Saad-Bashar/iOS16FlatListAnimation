import { StyleSheet, Text, View, ImageBackground } from "react-native";
import wallpaper from "./assets/images/wallpaper.webp";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationsList from "./src/components/NotificationList";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

export default function App() {
  const [date, setDate] = useState(dayjs());
  const footerVisibility = useSharedValue(1);
  const footerHeight = useDerivedValue(() => {
    return interpolate(footerVisibility.value, [0, 1], [0, 85]);
  });

  useEffect(() => {
    let timer = setInterval(() => {
      setDate(dayjs());
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      opacity: footerVisibility.value,
      marginTop: interpolate(footerVisibility.value, [0, 1], [-85, 0]),
    };
  });

  return (
    <ImageBackground source={wallpaper} style={StyleSheet.absoluteFill}>
      <View style={styles.header}>
        <Ionicons name="ios-lock-closed" size={20} color="white" />
        <Text style={styles.date}>{date.format("dddd, DD MMMM")}</Text>
        <Text style={styles.time}>{date.format("hh:mm")}</Text>
      </View>

      {/* Notification List */}
      <NotificationsList
        footerVisibility={footerVisibility}
        footerHeight={footerHeight}
      />

      {/* footer */}
      <Animated.View style={[styles.footer, animatedFooterStyle]}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="flashlight" size={24} color="white" />
        </View>

        <View style={styles.icon}>
          <Ionicons name="ios-camera" size={24} color="white" />
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
  },
  date: {
    color: "#C3FFFE",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
  },
  time: {
    fontSize: 82,
    fontWeight: "bold",
    color: "#C3FFFE",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingVertical: 10,
    paddingHorizontal: 30,
    height: 75,
  },
  icon: {
    backgroundColor: "#00000050",
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
