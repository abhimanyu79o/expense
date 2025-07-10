import { 
  type Nominee, 
  type Vote, 
  type Admin, 
  type InsertNominee, 
  type InsertVote, 
  type InsertAdmin 
} from "@shared/schema";

export interface IStorage {
  // Nominee operations
  getNominees(): Promise<Nominee[]>;
  getNominee(id: number): Promise<Nominee | undefined>;
  createNominee(nominee: InsertNominee): Promise<Nominee>;
  updateNominee(id: number, nominee: Partial<Nominee>): Promise<Nominee | undefined>;
  deleteNominee(id: number): Promise<boolean>;
  
  // Vote operations
  getVotes(): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByNominee(nomineeId: number): Promise<Vote[]>;
  
  // Admin operations
  getAdmin(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private nominees: Map<number, Nominee>;
  private votes: Map<number, Vote>;
  private admins: Map<string, Admin>;
  private currentNomineeId: number;
  private currentVoteId: number;
  private currentAdminId: number;

  constructor() {
    this.nominees = new Map();
    this.votes = new Map();
    this.admins = new Map();
    this.currentNomineeId = 1;
    this.currentVoteId = 1;
    this.currentAdminId = 1;
    
    // Initialize with default admin
    this.createAdmin({ username: "ADMIN", password: "1234" });
    
    // Add sample nominees for demonstration
    this.initializeSampleNominees();
  }

  private initializeSampleNominees() {
    const sampleNominees = [
      {
        name: "Alice Johnson",
        logo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Bob Smith", 
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Carol Davis",
        logo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "David Wilson",
        logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    ];

    for (const nominee of sampleNominees) {
      const id = this.currentNomineeId++;
      const newNominee: Nominee = {
        ...nominee,
        id,
        voteCount: 0,
        createdAt: new Date().toISOString(),
      };
      this.nominees.set(id, newNominee);
    }
  }

  // Nominee operations
  async getNominees(): Promise<Nominee[]> {
    return Array.from(this.nominees.values());
  }

  async getNominee(id: number): Promise<Nominee | undefined> {
    return this.nominees.get(id);
  }

  async createNominee(insertNominee: InsertNominee): Promise<Nominee> {
    const id = this.currentNomineeId++;
    const nominee: Nominee = {
      ...insertNominee,
      id,
      voteCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.nominees.set(id, nominee);
    return nominee;
  }

  async updateNominee(id: number, updateData: Partial<Nominee>): Promise<Nominee | undefined> {
    const nominee = this.nominees.get(id);
    if (!nominee) return undefined;
    
    const updatedNominee = { ...nominee, ...updateData };
    this.nominees.set(id, updatedNominee);
    return updatedNominee;
  }

  async deleteNominee(id: number): Promise<boolean> {
    return this.nominees.delete(id);
  }

  // Vote operations
  async getVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = {
      ...insertVote,
      id,
      createdAt: new Date().toISOString(),
    };
    this.votes.set(id, vote);
    
    // Update nominee vote count
    const nominee = this.nominees.get(insertVote.nomineeId);
    if (nominee) {
      nominee.voteCount += 1;
      this.nominees.set(nominee.id, nominee);
    }
    
    return vote;
  }

  async getVotesByNominee(nomineeId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(vote => vote.nomineeId === nomineeId);
  }

  // Admin operations
  async getAdmin(username: string): Promise<Admin | undefined> {
    return this.admins.get(username);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = {
      ...insertAdmin,
      id,
    };
    this.admins.set(admin.username, admin);
    return admin;
  }
}

export const storage = new MemStorage();
