import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Plus, Edit, Trash2, BarChart3, Users, LogOut } from "lucide-react";
import type { Nominee } from "@shared/schema";

interface NomineeFormProps {
  nominee?: Nominee;
  onClose: () => void;
}

function NomineeForm({ nominee, onClose }: NomineeFormProps) {
  const [formData, setFormData] = useState({
    name: nominee?.name || "",
    logo: nominee?.logo || "",
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; logo: string }) => {
      const response = await fetch("/api/admin/nominees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create nominee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      toast({ title: "Success", description: "Nominee created successfully" });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; logo: string }) => {
      const response = await fetch(`/api/admin/nominees/${nominee?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update nominee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      toast({ title: "Success", description: "Nominee updated successfully" });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nominee) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{nominee ? "Edit Nominee" : "Add New Nominee"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              required
            />
          </div>
          {formData.logo && (
            <div className="text-center">
              <img
                src={formData.logo}
                alt="Preview"
                className="w-16 h-16 rounded-full mx-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/64?text=${formData.name.charAt(0)}`;
                }}
              />
            </div>
          )}
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {nominee ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingNominee, setEditingNominee] = useState<Nominee | undefined>();
  const queryClient = useQueryClient();

  // Check auth
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: nominees = [] } = useQuery<Nominee[]>({
    queryKey: ["nominees"],
    queryFn: async () => {
      const response = await fetch("/api/nominees");
      if (!response.ok) throw new Error("Failed to fetch nominees");
      return response.json();
    },
  });

  const { data: results = [] } = useQuery<Nominee[]>({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const response = await fetch("/api/admin/results");
      if (!response.ok) throw new Error("Failed to fetch results");
      return response.json();
    },
    refetchInterval: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/nominees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete nominee");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      toast({ title: "Success", description: "Nominee deleted successfully" });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setLocation("/admin");
  };

  const handleEdit = (nominee: Nominee) => {
    setEditingNominee(nominee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNominee(undefined);
  };

  const totalVotes = results.reduce((sum, nominee) => sum + nominee.voteCount, 0);
  
  const chartData = results.map((nominee, index) => ({
    name: nominee.name,
    value: nominee.voteCount,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nominees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nominees.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leading Nominee</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.length > 0 
                ? results.reduce((max, nominee) => nominee.voteCount > max.voteCount ? nominee : max).name
                : "N/A"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="nominees" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nominees">Manage Nominees</TabsTrigger>
          <TabsTrigger value="results">Live Results</TabsTrigger>
        </TabsList>

        <TabsContent value="nominees" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Nominees</h2>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Nominee
            </Button>
          </div>

          {showForm && (
            <NomineeForm nominee={editingNominee} onClose={handleCloseForm} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nominees.map((nominee) => (
              <Card key={nominee.id}>
                <CardHeader className="text-center pb-4">
                  <img
                    src={nominee.logo}
                    alt={nominee.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/64?text=${nominee.name.charAt(0)}`;
                    }}
                  />
                  <CardTitle className="text-lg">{nominee.name}</CardTitle>
                  <Badge variant="secondary">{nominee.voteCount} votes</Badge>
                </CardHeader>
                <CardContent className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(nominee)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(nominee.id)}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <h2 className="text-xl font-semibold">Live Voting Results</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {totalVotes > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No votes yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vote Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((nominee, index) => {
                    const percentage = totalVotes > 0 ? (nominee.voteCount / totalVotes) * 100 : 0;
                    return (
                      <div key={nominee.id} className="flex items-center space-x-4">
                        <img
                          src={nominee.logo}
                          alt={nominee.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{nominee.name}</span>
                            <span className="text-sm text-gray-500">
                              {nominee.voteCount} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}