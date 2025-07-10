import { z } from "zod";

export interface Nominee {
  id: number;
  name: string;
  logo: string; // URL or base64 image
  voteCount: number;
  createdAt: string;
}

export interface Vote {
  id: number;
  nomineeId: number;
  voterIp?: string; // Optional: track IP to prevent multiple votes
  createdAt: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}

export const insertNomineeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(1, "Logo is required"),
});

export const insertVoteSchema = z.object({
  nomineeId: z.number(),
  voterIp: z.string().optional(),
});

export const insertAdminSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertNominee = z.infer<typeof insertNomineeSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
