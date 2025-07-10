import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNomineeSchema, 
  insertVoteSchema, 
  adminLoginSchema, 
  type Nominee 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Public Routes - For voting
  
  // Get all nominees
  app.get("/api/nominees", async (req, res) => {
    try {
      const nominees = await storage.getNominees();
      res.json(nominees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nominees" });
    }
  });

  // Submit a vote
  app.post("/api/vote", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      const voterIp = req.ip || req.connection.remoteAddress;
      
      // Check if nominee exists
      const nominee = await storage.getNominee(voteData.nomineeId);
      if (!nominee) {
        return res.status(404).json({ error: "Nominee not found" });
      }

      const vote = await storage.createVote({
        ...voteData,
        voterIp,
      });

      res.json({ message: "Vote submitted successfully", vote });
    } catch (error) {
      res.status(400).json({ error: "Invalid vote data" });
    }
  });

  // Get voting results (public)
  app.get("/api/results", async (req, res) => {
    try {
      const nominees = await storage.getNominees();
      const results = nominees.map(nominee => ({
        id: nominee.id,
        name: nominee.name,
        logo: nominee.logo,
        voteCount: nominee.voteCount,
      }));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  // Admin Routes
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const loginData = adminLoginSchema.parse(req.body);
      const admin = await storage.getAdmin(loginData.username);
      
      if (!admin || admin.password !== loginData.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, you'd use JWT or sessions
      res.json({ 
        message: "Login successful", 
        admin: { id: admin.id, username: admin.username } 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  // Admin: Create nominee
  app.post("/api/admin/nominees", async (req, res) => {
    try {
      const nomineeData = insertNomineeSchema.parse(req.body);
      const nominee = await storage.createNominee(nomineeData);
      res.json(nominee);
    } catch (error) {
      res.status(400).json({ error: "Invalid nominee data" });
    }
  });

  // Admin: Update nominee
  app.put("/api/admin/nominees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const nomineeData = insertNomineeSchema.parse(req.body);
      
      const updatedNominee = await storage.updateNominee(id, nomineeData);
      if (!updatedNominee) {
        return res.status(404).json({ error: "Nominee not found" });
      }
      
      res.json(updatedNominee);
    } catch (error) {
      res.status(400).json({ error: "Invalid nominee data" });
    }
  });

  // Admin: Delete nominee
  app.delete("/api/admin/nominees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNominee(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Nominee not found" });
      }
      
      res.json({ message: "Nominee deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete nominee" });
    }
  });

  // Admin: Get detailed results
  app.get("/api/admin/results", async (req, res) => {
    try {
      const nominees = await storage.getNominees();
      const votes = await storage.getVotes();
      
      const results = nominees.map(nominee => ({
        ...nominee,
        votes: votes.filter(vote => vote.nomineeId === nominee.id),
      }));
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch detailed results" });
    }
  });

  // Admin: Get all votes
  app.get("/api/admin/votes", async (req, res) => {
    try {
      const votes = await storage.getVotes();
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
