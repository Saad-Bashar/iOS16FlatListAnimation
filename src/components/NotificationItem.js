import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export const NOTIFICATION_HEIGHT = 80;

const NotificationItem = ({
  data,
  index,
  listVisibility,
  scrollY,
  footerHeight,
}) => {
  const { height } = useWindowDimensions();
  const startPosition = index * NOTIFICATION_HEIGHT;
  const containerHeight = useDerivedValue(
    () => height - 250 - footerHeight.value
  );

  const animatedStyle = useAnimatedStyle(() => {
    const pos1 = startPosition - containerHeight.value;
    const pos2 = startPosition + NOTIFICATION_HEIGHT - containerHeight.value;
    if (listVisibility.value >= 1) {
      // animate the last item
      return {
        opacity: interpolate(scrollY.value, [pos1, pos2], [0, 1]),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [pos1, pos2],
              [-NOTIFICATION_HEIGHT / 2, 0],
              Animated.Extrapolate.CLAMP
            ),
          },
          {
            scale: interpolate(
              scrollY.value,
              [pos1, pos2],
              [0.8, 1],
              Animated.Extrapolate.CLAMP
            ),
          },
        ],
      };
    } else {
      // animate all items to hide them
      return {
        transform: [
          {
            translateY: interpolate(
              listVisibility.value,
              [0, 1],
              [containerHeight.value - startPosition, 0]
            ),
          },
          {
            scale: interpolate(
              listVisibility.value,
              [0, 1],
              [0.5, 1],
              Animated.Extrapolate.CLAMP
            ),
          },
        ],
        opacity: listVisibility.value,
      };
    }
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={data.icon} style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {data.subtitle}
        </Text>
      </View>
      <Text style={styles.time}>{data.createdAt} ago</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: NOTIFICATION_HEIGHT - 10,
    backgroundColor: "#00000075",
    margin: 5,
    marginHorizontal: 10,
    padding: 13,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: "lightgray",
    fontSize: 12,
    position: "absolute",
    right: 10,
    top: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "white",
    lineHeight: 18,
    letterSpacing: 0.2,
  },
});

export default NotificationItem;
