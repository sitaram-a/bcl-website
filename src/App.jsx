import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <AppRoutes />
      </main>

      <Analytics />
    </BrowserRouter>
  );
}

export default App;
