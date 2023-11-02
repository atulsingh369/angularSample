/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {
  getFirestore,
} from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const db = getFirestore();
export const notification = onRequest((req, res) => {
  logger.info("Hello logs!", {structuredData: true});
  res.send("Atul Singh!");
});

// firestore trigger for tracking activity
exports.myfunction = onDocumentCreated("invoices/{id}", async (e) => {
  if (!(e.data && e.data.data())) return;

  const invoiceData: any = e.data.data();
  console.log(e);
  await db.collection("notifications").add({
    email: invoiceData.userEmail,
    displayName: invoiceData.userDisplayName,
    message: `The ${e.data.id} has been added by ${invoiceData.userEmail}`,
  });
  console.log("added");
});
