/**
 * MARKIR - User Type Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
}
