import { extendTheme } from "native-base";

// Sukuriame custom NativeBase temą
const theme = extendTheme({
  colors: {
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3', // pagrindinė spalva
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "primary",
      },
    },
    Text: {
      baseStyle: {
        color: "#0C2736", // Numatytoji spalva
        fontFamily: "Inter",
      },
      variants: {
        header1: {
          fontSize: "32px",
          fontWeight: "400",
          fontFamily: "SFUIDisplay-Bold",
        },
        header1Bold: {
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "SFUIDisplay-Bold",
        },
        header1BoldHighlighted: {
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "SFUIDisplay-Bold",
          color: "#FF9800", // Oranžinė spalva
        },
        header2: {
          fontSize: "20px",
          fontWeight: "400",
          fontFamily: "SFUIDisplay-Bold",
        },
        header2Bold: {
          fontSize: "20px",
          fontWeight: "bold",
          fontFamily: "SFUIDisplay-Bold",
        },
        header3: {
          fontSize: "16px",
          fontWeight: "400",
          fontFamily: "SFUIDisplay-Bold",
        },
        header3Bold: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "SFUIDisplay-Bold",
        },
        body: {
          fontSize: "15px",
          fontWeight: "400",
        },
        bodyBold: {
          fontSize: "15px",
          fontWeight: "bold",
        },
        bodyGray: {
          fontSize: "15px",
          fontWeight: "400",
          color: "rgba(0,0,0,0.5)", // Pusiau permatomas pilkas
        },
        bodyBoldGray: {
          fontSize: "15px",
          fontWeight: "bold",
          color: "rgba(0,0,0,0.5)", // Pusiau permatomas pilkas
        },
        link: {
          fontSize: "15px",
          fontWeight: "400",
          color: "#237DB0",
        },
      },
    },
  },
});

export default theme;
