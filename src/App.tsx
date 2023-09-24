import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { ConfigProvider } from "antd";
import es from "antd/locale/es_ES";

function App() {
  return (
    <ConfigProvider locale={es}>
      <BrowserRouter>
        <QueryClientProvider client={new QueryClient()}>
          <AppRoutes />
        </QueryClientProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
