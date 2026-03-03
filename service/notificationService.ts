import axios from "axios";
import { Notification } from "@/types";

// Get all unread notifications
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const res = await axios.get("/api/notification");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationRead = async (id: number): Promise<void> => {
  try {
    await axios.put(`/api/notification/${id}`);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};