import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main>
        <AppRoutes />
      </main>

    </BrowserRouter>
  );
}

export default App;