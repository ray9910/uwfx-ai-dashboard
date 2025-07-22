"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.polarWebhook = exports.createPolarCheckout = void 0;
/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const sdk_1 = require("@polar-sh/sdk");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors")({ origin: true });
// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
// Initialize Polar SDK using environment variables for the token
const polar = new sdk_1.Polar({
    token: functions.config().polar.token,
});
// --- Mappings for your subscription plans ---
// IMPORTANT: Replace these with your actual Polar Product IDs
const POLAR_PLANS = {
    // Replace with your actual "Starter" plan Product ID from Polar
    "PRODUCT_ID_STARTER": { credits: 50, name: "Starter" },
    // Replace with your actual "Pro" plan Product ID from Polar
    "PRODUCT_ID_PRO": { credits: 200, name: "Pro" },
};
/**
 * Creates a Polar checkout session for a user to subscribe to a plan.
 */
exports.createPolarCheckout = functions.https.onCall(async (data, context) => {
    // Check for authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { productId } = data;
    const uid = context.auth.uid;
    const email = context.auth.token.email || "";
    if (!productId || typeof productId !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with a 'productId' string.");
    }
    try {
        const checkoutSession = await polar.checkouts.create({
            product_id: productId,
            customer_email: email,
            // This links the Polar customer to your Firebase user
            external_customer_id: uid,
        });
        if (checkoutSession.url) {
            return { url: checkoutSession.url };
        }
        else {
            throw new Error("Could not create a checkout session.");
        }
    }
    catch (error) {
        console.error("Error creating Polar checkout session:", error);
        throw new functions.https.HttpsError("internal", "Failed to create checkout session.");
    }
});
/**
 * Handles webhook events from Polar to update subscription status in Firestore.
 */
exports.polarWebhook = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        // It's good practice to verify the webhook signature in production
        // For now, we'll process the event directly.
        const event = req.body;
        const eventType = event.type;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload = event.payload;
        try {
            let uid;
            // eslint-disable-next-line
            let subscriptionData;
            if (eventType === "subscription.created" ||
                eventType === "subscription.updated") {
                uid = payload.customer.external_id;
                subscriptionData = payload;
            }
            else {
                console.log(`Unhandled event type: ${eventType}`);
                res.status(200).send(`OK (Unhandled: ${eventType})`);
                return;
            }
            if (!uid) {
                console.warn("Webhook received without an external_id (uid).");
                res.status(400).send("Webhook missing user identifier.");
                return;
            }
            const userDocRef = db.collection("users").doc(uid);
            const planConfig = POLAR_PLANS[subscriptionData.product.id];
            if (!planConfig) {
                const errorMsg = `Unknown product ID: ${subscriptionData.product.id}`;
                console.error(errorMsg);
                res.status(400).send(errorMsg);
                return;
            }
            const statusMapping = {
                [sdk_1.SubscriptionStatus.ACTIVE]: "active",
                [sdk_1.SubscriptionStatus.PAST_DUE]: "past_due",
                [sdk_1.SubscriptionStatus.CANCELED]: "canceled",
                [sdk_1.SubscriptionStatus.INCOMPLETE]: "inactive",
                [sdk_1.SubscriptionStatus.INCOMPLETE_EXPIRED]: "inactive",
                [sdk_1.SubscriptionStatus.TRIALING]: "active",
            };
            const newStatus = statusMapping[subscriptionData.status] || "inactive";
            const updateData = {
                subscriptionStatus: newStatus,
                subscriptionId: subscriptionData.id,
                polarCustomerId: subscriptionData.customer.id,
                currentPlan: planConfig.name,
                // Grant the credits associated with the plan
                credits: planConfig.credits,
                // Set a timestamp for when credits were last granted/reset
                lastCreditReset: admin.firestore.FieldValue.serverTimestamp(),
            };
            await userDocRef.set(updateData, { merge: true });
            const successMsg = `Updated subscription for ${uid} to ${newStatus}.`;
            console.log(successMsg);
            res.status(200).send("Webhook received successfully.");
        }
        catch (error) {
            console.error("Error processing Polar webhook:", error);
            res.status(500).send("Internal Server Error");
        }
    });
});
//# sourceMappingURL=index.js.map