import { View, Pressable, Text, StyleSheet } from "react-native";

type Props = {
    label: string;
    onPress: () => void; // ✅ Pridedame onPress
    theme?: "primary";
};

export default function Button({ label, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={styles.button}
                onPress={onPress} // ✅ Čia kviečiame funkciją
            >
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 80,
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
    },
    button: {
        borderRadius: 24,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#007bff", // Pridėta spalva, kad matytųsi mygtukas
    },
    buttonLabel: {
        color: "#fff",
        fontSize: 16,
    },
});
