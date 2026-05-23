export type RootStackParamList ={
    Main:undefined,
    AiGame:undefined,
    MultiplayerGame:undefined,
    GenericGameScreen:{
        mode:'Solo'|'Multiplayer';
        roomId?:string;
        playerColor?:'white'|'black';
        isHost?:boolean;
    };
};