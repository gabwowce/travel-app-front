import { extendTheme } from "native-base";

// Sukuriame custom NativeBase temą
const theme = extendTheme({
  colors: {
    primary: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#0C2736",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
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
