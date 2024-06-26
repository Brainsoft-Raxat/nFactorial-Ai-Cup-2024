/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

admin.initializeApp();

exports.createNewUser = functions.auth.user().onCreate(async (user: { uid: any; email: any; displayName: any; photoURL: any; }) => {
    const userRef = admin.firestore().doc(`users/${user.uid}`);
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    userRef.set(userData).then(() => {
        logger.log(`Successfully created new user document for UID: ${user.uid}`);
    })
        .catch((error: any) => {
            logger.error(`Error creating new user document for UID: ${user.uid}`, error);
        });
    logger.log("User created:", user.uid);
});