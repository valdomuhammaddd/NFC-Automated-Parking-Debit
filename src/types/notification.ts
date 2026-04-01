/**
 * MARKIR - Notification Type Definitions
 */

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}
