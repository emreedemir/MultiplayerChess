
import React from "react";
import { View ,StyleSheet,Text, ActivityIndicator} from "react-native";

interface PlayerLabelProps
{
    isOpponentThinking:boolean;
    opponentName:string;
}
export default function PlayerLabel({isOpponentThinking,opponentName}:PlayerLabelProps)
{
    return(
        <View style={styles.ribbon}>
            <Text style={styles.text}>{opponentName}</Text>
            {isOpponentThinking &&<ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    ribbon: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
    text: { color: "white", fontSize: 18, fontWeight: "bold" },
});