import { useState, useMemo } from "react";
import { View, Text, Modal, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from '@tanstack/react-query';
import { ref, get } from 'firebase/database';
import { database } from "../services/firebaseConfig";

interface FriendModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
}

export default function PlayWithYourFriendModal({ visible, onClose, onJoin }: FriendModalProps) {
  const [searchText, setSearchText] = useState("");

  const { data: publicRooms = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['publicRooms'],
    queryFn: async () => {
      const snapshot = await get(ref(database, 'rooms'));
      if (!snapshot.exists()) return [];
      
      const roomsObj = snapshot.val();
      const roomsArray = [];
      
      for (const roomId in roomsObj) {
        if (roomsObj[roomId].status === 'waiting') {
          roomsArray.push(roomId);
        }
      }
      return roomsArray;
    },
    enabled: visible,
  });

  const filteredGames = useMemo(() => {
    return publicRooms.filter((game: string) => game.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, publicRooms]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.centered}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Find Game</Text>
          </View>

          <View style={styles.searchGameContainer}>
            <Text style={styles.searchGameText}>Search Game Code</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Enter Game Name/Code..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor={"gray"}
                />
                <Pressable style={styles.joinCustomBtn} onPress={() => searchText.trim() && onJoin(searchText)}>
                     <Text style={styles.joinCustomText}>Join</Text>
                </Pressable>
            </View>
          </View>

          <View style={styles.listedGameContainer}>
            <View style={styles.rowBetween}>
                <Text style={styles.searchGameText}>Current Public Games</Text>
                <Pressable onPress={() => refetch()}><Text style={{color: 'black'}}>Refresh</Text></Pressable>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1129f1" style={{marginTop: 20}} />
            ) : isError ? (
                <Text style={styles.emptyText}>Error loading rooms.</Text>
            ) : (
                <FlatList
                  data={filteredGames}
                  keyExtractor={(item) => item}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Pressable style={styles.ribbonContainer} onPress={() => onJoin(item)}>
                      <Text style={styles.ribbonText}>{item}</Text>
                      <Text style={styles.joinHint}>Join</Text>
                    </Pressable>
                  )}
                  ListEmptyComponent={<Text style={styles.emptyText}>No waiting rooms found</Text>}
                />
            )}
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
  centered: { width: 340, height: 500, backgroundColor: "#fff", borderRadius: 25, padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "700" },
  searchGameContainer: { marginBottom: 20 },
  searchGameText: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameInput: { flex: 1, height: 45, borderRadius: 15, borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 15, fontSize: 15 },
  joinCustomBtn: { backgroundColor: 'black', height: 45, paddingHorizontal: 15, borderRadius: 12, justifyContent: 'center' },
  joinCustomText: { color: 'white', fontWeight: 'bold' },
  listedGameContainer: { flex: 1 },
  ribbonContainer: { width: "100%", height: 55, borderRadius: 15, borderWidth: 1, borderColor: "#ddd", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15, marginBottom: 10, backgroundColor: '#f9f9f9' },
  ribbonText: { fontSize: 16, fontWeight: "500" },
  joinHint: { fontSize: 12, color: 'gray' },
  emptyText: { textAlign: "center", marginTop: 20, color: "gray" },
  closeButton: { height: 30, backgroundColor: "white", borderRadius: 15, justifyContent: "center", alignItems: "center", marginTop: 30,borderWidth:0.3,width:130,alignSelf:'center' },
  closeButtonText: { color: "black", fontSize: 16, fontWeight: "600" },
});