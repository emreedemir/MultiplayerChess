import * as React from 'react';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';
import { useAuthStore } from './src/store/useAuthStore';
import MainScreen from './src/screens/MainScreen';
import GenericGameScreen from './src/screens/GenericGameScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
    const setAuth = useAuthStore(state => state.setAuth);
    const isAuthLoading = useAuthStore(state => state.isAuthLoading);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const autoName = "Guest-" + user.uid.substring(0, 5);
                setAuth(user.uid, autoName);
            } else {
                signInAnonymously(auth).catch(() => {});
            }
        });
        return () => unsubscribe();
    }, []);

    if (isAuthLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1129f1" />
            </View>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main">
                    <Stack.Screen 
                        name="Main" 
                        component={MainScreen} 
                        options={{ title: 'Main Menu',headerShown:false }} 
                    />
                    <Stack.Screen 
                        name="GenericGameScreen" 
                        component={GenericGameScreen} 
                        options={{ title: 'Chess', headerShown: false }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    }
});