import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PlayWithAiModal from "../modals/PlayWithAiModal";
import PlayWithYourFriendModal from "../modals/PlayWithYourFriendModal";
import CreateGameModal from "../modals/CreateGameModal";
import { RootStackParamList } from "../types/navigation";
import { useAuthStore } from "../store/useAuthStore";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function MainScreen() {
    const navigation = useNavigation<NavigationProps>();
    const playerName = useAuthStore(state => state.playerName);

    const [friendModalVisible, setFriendModalVisible] = useState<boolean>(false);
    const [createGameModalVisible, setCreateGameModalVisible] = useState<boolean>(false);
    const [playWithAiModalVisible, setPlayWithAiModalVisible] = useState<boolean>(false);

    const startGameWithAi = (color: string) => {
        navigation.navigate('GenericGameScreen', { 
            mode: 'Solo', 
            playerColor: color as 'white' | 'black'
        });
    };

    const handleCreateRoom = (roomId: string) => {
        navigation.navigate('GenericGameScreen', { 
            mode: 'Multiplayer', 
            roomId: roomId,
            isHost: true
        });
    };

    const handleJoinRoom = (roomId: string) => {
        navigation.navigate('GenericGameScreen', { 
            mode: 'Multiplayer', 
            roomId: roomId,
            isHost: false
        });
    };

    const gameIcon = "♚\uFE0E";

    return (
        <View style={styles.container}>
            <Text style={styles.gameIconText}>{gameIcon}</Text>
            <Text style={styles.welcomeText}>Welcome, {playerName}</Text>

            <TouchableOpacity style={styles.button} onPress={() => setCreateGameModalVisible(true)}>
                <Text style={styles.buttonText}>Create Room</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setFriendModalVisible(true)}>
                <Text style={styles.buttonText}>Join Room</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setPlayWithAiModalVisible(true)}>
                <Text style={styles.buttonText}>Play vs AI</Text>
            </TouchableOpacity>

            <PlayWithAiModal
                visible={playWithAiModalVisible}
                onClose={() => setPlayWithAiModalVisible(false)}
                onStart={(color: string) => {
                    setPlayWithAiModalVisible(false);
                    startGameWithAi(color);
                }} 
            />

            <PlayWithYourFriendModal
                visible={friendModalVisible}
                onClose={() => setFriendModalVisible(false)}
                onJoin={(roomId: string) => {
                    setFriendModalVisible(false);
                    handleJoinRoom(roomId);
                }}
            />

            <CreateGameModal
                visible={createGameModalVisible}
                onClose={() => setCreateGameModalVisible(false)}
                onStart={(roomId: string) => {
                    setCreateGameModalVisible(false);
                    handleCreateRoom(roomId);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    gameIconText: {
        fontSize: 100,
        marginBottom: 20
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 60,
        color: '#333'
    },
    button: {
        height: 50,
        width: '65%',
        alignItems: 'center',
        marginVertical: 15,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#0d1b99',
        padding: 10,
        backgroundColor: 'black',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '900',
        color: '#fff'
    }
});