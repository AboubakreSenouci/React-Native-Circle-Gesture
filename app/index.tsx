import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface AnimatedStyle {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
}

const useFollowAnimatedPosition = ({
  translateX,
  translateY,
}: AnimatedStyle) => {
  const folowX = useDerivedValue(() => {
    return withSpring(translateX.value);
  });
  const folowY = useDerivedValue(() => {
    return withSpring(translateY.value);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: folowX.value,
        },
        {
          translateY: folowY.value,
        },
      ],
    };
  });
  return {
    animatedStyle,
    folowX,
    folowY,
  };
};
export default function Index() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    });

  const {
    animatedStyle: redCircleAnimatedStyle,
    folowX: redCircleFolowX,
    folowY: redCircleFolowY,
  } = useFollowAnimatedPosition({
    translateX,
    translateY,
  });

  const {
    animatedStyle: greenCircleAnimatedStyle,
    folowX: greenCircleFolowX,
    folowY: greenCircleFolowY,
  } = useFollowAnimatedPosition({
    translateX: redCircleFolowX,
    translateY: redCircleFolowY,
  });

  const { animatedStyle: blueCircleAnimatedStyle } = useFollowAnimatedPosition({
    translateX: greenCircleFolowX,
    translateY: greenCircleFolowY,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.greenCircleStyle, greenCircleAnimatedStyle]}
      />
      <Animated.View
        style={[styles.blueCircleStyle, blueCircleAnimatedStyle]}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.redCircleStyle, redCircleAnimatedStyle]}
        />
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  redCircleStyle: {
    height: 60,
    width: 60,
    backgroundColor: "red",
    borderRadius: 40,
    position: "absolute",
  },
  greenCircleStyle: {
    height: 60,
    width: 60,
    backgroundColor: "green",
    borderRadius: 40,
    position: "absolute",
  },
  blueCircleStyle: {
    height: 60,
    width: 60,
    backgroundColor: "blue",
    borderRadius: 40,
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
