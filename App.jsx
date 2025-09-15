import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SchoolPaymentDashboard from "./SchoolPaymentDashboard";

function App() {
  const [count, setCount] = useState(0);

  return <SchoolPaymentDashboard></SchoolPaymentDashboard>;
}

export default App;
