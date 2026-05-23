import { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, TextInput, Pressable, ActivityIndicator } from "react-native";

interface CreateGameProps {
  visible: boolean;
  onClose: () => void;
  onStart: (roomId: string) => void;
}

export default function CreateGameModal({ visible, onClose, onStart }: CreateGameProps) {
  const [gameName, setGameName] = useState("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setIsWaiting(false);
      setGameName("Room-" + Math.floor(Math.random() * 10000));
    }
  }, [visible]);

  function handleStartGame() {
    if (gameName.trim().length === 0) return;
    setIsWaiting(true);

    setTimeout(() => {
      setIsWaiting(false);
      onStart(gameName);
    }, 1000);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Create Room (Host)</Text>
          </View>

          <View style={styles.subSection}>
            <TextInput
              style={styles.gameNameInput}
              placeholder="Enter Game Name..."
              value={gameName}
              onChangeText={setGameName}
              placeholderTextColor={"gray"}
            />
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.gameNameText}>Room Code: {gameName}</Text>

            {isWaiting ? (
              <ActivityIndicator size="small" style={styles.loader} />
            ) : (
              <Pressable style={styles.startGameButton} onPress={handleStartGame}>
                <Text style={styles.startGameButtonText}>Create Room</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  centerContainer: { backgroundColor: "white", width: "80%", borderRadius: 20, padding: 20 },
  header: { alignItems: "center", marginBottom: 25 },
  headerText: { fontSize: 24, fontWeight: "700" },
  subSection: { marginBottom: 30 },
  gameNameInput: { width: "100%", paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 15, fontSize: 16 },
  footerSection: { alignItems: "center" },
  gameNameText: { marginBottom: 20, fontSize: 16, fontWeight: "600" },
  startGameButton: { width: 160, height: 50, backgroundColor: "black", borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 15 },
  startGameButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  loader: { marginVertical: 20 },
  closeButton: { width: 160, height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 15, justifyContent: "center", alignItems: "center" },
  closeButtonText: { fontSize: 15, fontWeight: "600" },
});