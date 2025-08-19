import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Signup Function
export const signUp = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error(error.message);  // Throw the error for the UI to handle
    }
};

// Login Function
export const logIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error(error.message);  // Throw the error for the UI to handle
    }
};

// Logout Function
export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(error.message);  // Throw the error for the UI to handle
    }
};

// Get Current User
export const getCurrentUser = (callback) => {
    return onAuthStateChanged(auth, callback);
};
