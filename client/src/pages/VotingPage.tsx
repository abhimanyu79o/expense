import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import type { Nominee } from "@shared/schema";

interface VotingCountdownProps {
  nomineeId: number;
  nomineeName: string;
  onVoteComplete: () => void;
}

function VotingCountdown({ nomineeId, nomineeName, onVoteComplete }: VotingCountdownProps) {
  const [countdown, setCountdown] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();

  const submitVoteMutation = useMutation({
    mutationFn: async (nomineeId: number) => {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomineeId }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
      onVoteComplete();
      toast({
        title: "Vote Submitted!",
        description: `Your vote for ${nomineeName} has been recorded.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Play beep sound
      const audio = new Audio();
      audio.frequency = 800;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Submit vote
      submitVoteMutation.mutate(nomineeId);
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, countdown, nomineeId, submitVoteMutation]);

  const startVoting = () => {
    setIsActive(true);
    setCountdown(10);
  };

  const cancelVoting = () => {
    setIsActive(false);
    setCountdown(10);
    onVoteComplete();
  };

  if (!isActive && countdown === 10) {
    return (
      <Button onClick={startVoting} className="w-full bg-blue-600 hover:bg-blue-700">
        Vote for {nomineeName}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 mb-2">{countdown}</div>
        <Progress value={(10 - countdown) * 10} className="mb-2" />
        <p className="text-sm text-gray-600">
          {countdown > 0 ? "Voting will be submitted automatically..." : "Submitting vote..."}
        </p>
      </div>
      {countdown > 0 && (
        <Button onClick={cancelVoting} variant="outline" className="w-full">
          Cancel Vote
        </Button>
      )}
    </div>
  );
}

export default function VotingPage() {
  const [activeVoting, setActiveVoting] = useState<number | null>(null);

  const { data: nominees = [], isLoading } = useQuery<Nominee[]>({
    queryKey: ["nominees"],
    queryFn: async () => {
      const response = await fetch("/api/nominees");
      if (!response.ok) {
        throw new Error("Failed to fetch nominees");
      }
      return response.json();
    },
  });

  const { data: results = [] } = useQuery<Nominee[]>({
    queryKey: ["results"],
    queryFn: async () => {
      const response = await fetch("/api/results");
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      return response.json();
    },
    refetchInterval: 5000, // Refresh results every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading nominees...</div>
      </div>
    );
  }

  const totalVotes = results.reduce((sum, nominee) => sum + nominee.voteCount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cast Your Vote</h1>
        <p className="text-lg text-gray-600">Choose your preferred nominee</p>
        <Badge variant="secondary" className="mt-2">
          Total Votes: {totalVotes}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {nominees.map((nominee) => {
          const votePercentage = totalVotes > 0 ? (nominee.voteCount / totalVotes) * 100 : 0;
          
          return (
            <Card key={nominee.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <img 
                    src={nominee.logo} 
                    alt={nominee.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/96?text=${nominee.name.charAt(0)}`;
                    }}
                  />
                </div>
                <CardTitle className="text-xl font-semibold">{nominee.name}</CardTitle>
                <div className="space-y-2">
                  <Badge variant="outline">
                    {nominee.voteCount} votes ({votePercentage.toFixed(1)}%)
                  </Badge>
                  <Progress value={votePercentage} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                {activeVoting === nominee.id ? (
                  <VotingCountdown
                    nomineeId={nominee.id}
                    nomineeName={nominee.name}
                    onVoteComplete={() => setActiveVoting(null)}
                  />
                ) : (
                  <Button
                    onClick={() => setActiveVoting(nominee.id)}
                    disabled={activeVoting !== null}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Vote for {nominee.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {nominees.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Nominees Available</h2>
          <p className="text-gray-500">Please check back later or contact the administrator.</p>
        </div>
      )}
    </div>
  );
}