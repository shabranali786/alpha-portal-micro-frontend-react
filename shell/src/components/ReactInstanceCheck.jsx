// shell/src/components/ReactInstanceCheck.jsx
import { useEffect, useRef } from "react";

export function ReactInstanceCheck() {
  const ref = useRef(null);

  useEffect(() => {
    console.log("✅ React hooks working correctly");
    console.log("React version:", require("react").version);
  }, []);

  return (
    <div ref={ref} style={{ display: "none" }}>
      React Check
    </div>
  );
}
