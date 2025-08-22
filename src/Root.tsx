import App from "App";
import { ThemeProvider } from "react-jss";
import { BrowserRouter } from "react-router-dom";
import theme from "theme/jssTheme";

export default function Root() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}
