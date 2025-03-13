import { View, Pressable, Text, StyleSheet } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
    theme?: "primary";
};

export default function Button({ label, onPress, theme = "primary" }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={[styles.button, theme === "primary" && styles.primaryButton]}
                onPress={onPress}
            >
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%", // ✅ Užtikrina, kad mygtukas prisitaikys prie konteinerio
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    button: {
        borderRadius: 12, // ✅ Apvalesni kampai
        paddingVertical: 16, // ✅ Geresnis mygtuko aukštis
        paddingHorizontal: 32,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        minWidth: 200, // ✅ Minimalus plotis
    },
    primaryButton: {
        backgroundColor: "#001F3F", // ✅ Tamsiai mėlynas fonas
    },
    buttonLabel: {
        color: "#FFFFFF", // ✅ Baltas tekstas
        fontSize: 18, // ✅ Didesnis tekstas
        fontWeight: "bold",
        textTransform: "uppercase", // ✅ Mygtuko tekstas didžiosiomis raidėmis
    },
});
