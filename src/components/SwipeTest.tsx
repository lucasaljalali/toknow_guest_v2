import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";

function SwipeComponent() {
  const [style, set] = useSpring(() => ({
    x: 0,
    backgroundColor: "lightgray",
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [x] }) => {
      // Prevent dragging left past a certain point
      if (x < 0) x = 0;

      // Update the x value in the spring
      set({ x, immediate: down });

      // Show or hide the trash icon based on the x position
      //const trashVisible = x > 50;  You can adjust the threshold
      // Update your UI or component state to show/hide the trash icon as needed
    },
    onDragEnd: () => {
      // Handle the swipe end event here
      // For example, if x is greater than a threshold, call a remove function
      if (style.x.get() > 100) {
        // Perform your remove action
        console.log("Remove action triggered");
      }

      // Reset the animation back to its original position
      set({ x: 0 });
    },
  });

  return (
    <animated.div
      {...bind()}
      style={{
        ...style,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Swipe to delete</span>
        <animated.div
          style={{
            marginLeft: "1rem",
            opacity: style.x.to((x) => (x > 0 ? 1 : 0)),
          }}
        >
          🗑️
        </animated.div>
      </div>
    </animated.div>
  );
}

export default SwipeComponent;
