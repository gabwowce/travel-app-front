import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "native-base";

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
                onPress={onPress}>
                <Text variant="header3" style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        borderRadius: 12, 
        paddingVertical: 20, 
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
    },
    primaryButton: {
        backgroundColor: "#001F3F", 
    },
    buttonLabel: {
        color: "#FFFFFF", 
    },
});
