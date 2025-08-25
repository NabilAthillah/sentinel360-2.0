// import "./i18n/i18n";
import { LoadScript } from "@react-google-maps/api";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyApktDuyS7d_DUd8uIDZZeL5KauAlxlc-M" language="en">
      <AppRoutes />
    </LoadScript>
  )
}

export default App;
