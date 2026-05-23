import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface GameOverModalProps {
    visible: boolean;
    message: string;
    onGoBack: () => void;
}

export default function GameOverModal({ visible, message, onGoBack }: GameOverModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.icon}>🏁</Text>
                    <Text style={styles.title}>Game Over</Text>
                    <Text style={styles.message}>{message}</Text>
                    
                    <TouchableOpacity style={styles.button} onPress={onGoBack}>
                        <Text style={styles.buttonText}>Return to Main Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    container: { backgroundColor: '#1f1f1f', padding: 30, borderRadius: 20, alignItems: 'center', width: '80%' },
    icon: { fontSize: 60, marginBottom: 10 },
    title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
    message: { color: '#cfcfcf', fontSize: 18, textAlign: 'center', marginBottom: 30 },
    button: { backgroundColor: '#1129f1', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});