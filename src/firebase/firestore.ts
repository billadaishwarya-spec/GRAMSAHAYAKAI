// src/firebase/firestore.ts
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";

export type ChatMessage = {
  id?: string;
  uid: string;
  role: "user" | "assistant";
  text: string;
  language: string;
  createdAt?: unknown;
};

export type Complaint = {
  id?: string;
  uid: string;
  category: string;
  description: string;
  status: "submitted" | "in_review" | "resolved";
  location?: string;
  createdAt?: unknown;
};

// --- Chat history (Firestore-backed, persists across sessions) ---

export async function saveChatMessage(msg: Omit<ChatMessage, "id" | "createdAt">) {
  return addDoc(collection(db, "chats"), {
    ...msg,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToChatHistory(
  uid: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "chats"),
    where("uid", "==", uid),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
    callback(messages);
  });
}

// --- Complaint tracking ---

export async function submitComplaint(complaint: Omit<Complaint, "id" | "createdAt" | "status">) {
  return addDoc(collection(db, "complaints"), {
    ...complaint,
    status: "submitted",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToComplaints(
  uid: string,
  callback: (complaints: Complaint[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "complaints"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const complaints = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Complaint));
    callback(complaints);
  });
}

export async function updateComplaintStatus(complaintId: string, status: Complaint["status"]) {
  await updateDoc(doc(db, "complaints", complaintId), { status });
}
