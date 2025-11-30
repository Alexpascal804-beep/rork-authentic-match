import createContextHook from "@nkzw/create-context-hook";
import { useState, useMemo, useCallback } from "react";
import { User, Match, Chat, Message } from "@/types";
import { mockUsers, mockMatches, currentUserId } from "@/mocks/users";
import { useVIP } from "@/contexts/VIPContext";

export const [AppProvider, useApp] = createContextHook(() => {
  const { isVIP, maxDistance } = useVIP();
  const [users] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [dailyLikesRemaining, setDailyLikesRemaining] = useState(20);
  const [dailyLimitEnabled] = useState(true);
  const [chats, setChats] = useState<Chat[]>([
    {
      matchId: "match-1",
      messages: [
        {
          id: "1",
          senderId: currentUserId,
          text: "Hey! I saw you love cooking too. What's your specialty?",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "2",
          senderId: "2",
          text: "Hey! I'm really into Italian cuisine. Just perfected my carbonara recipe!",
          timestamp: new Date(Date.now() - 86400000 + 3600000),
        },
        {
          id: "3",
          senderId: currentUserId,
          text: "That sounds amazing! I've been wanting to learn how to make proper carbonara",
          timestamp: new Date(Date.now() - 86400000 + 7200000),
        },
        {
          id: "4",
          senderId: "2",
          text: "I know a great little Italian place downtown. Their carbonara is what inspired me. Want to check it out?",
          timestamp: new Date(Date.now() - 86400000 + 10800000),
        },
        {
          id: "5",
          senderId: currentUserId,
          text: "Absolutely! I'm free this weekend if that works?",
          timestamp: new Date(Date.now() - 3600000 * 6),
        },
        {
          id: "6",
          senderId: "2",
          text: "That restaurant recommendation was perfect! We should go together next time 😊",
          timestamp: new Date(Date.now() - 3600000 * 2),
        },
      ],
    },
    {
      matchId: "match-2",
      messages: [
        {
          id: "1",
          senderId: "3",
          text: "Hi! Thanks for the match! I saw you're into wellness too",
          timestamp: new Date(Date.now() - 86400000 + 3600000),
        },
        {
          id: "2",
          senderId: currentUserId,
          text: "Hey Sofia! Yes, I've been really getting into mindfulness lately",
          timestamp: new Date(Date.now() - 3600000 * 12),
        },
        {
          id: "3",
          senderId: "3",
          text: "That's great! I teach yoga classes every weekend if you're interested",
          timestamp: new Date(Date.now() - 3600000 * 10),
        },
        {
          id: "4",
          senderId: currentUserId,
          text: "I'd love to join your yoga class sometime!",
          timestamp: new Date(Date.now() - 3600000 * 5),
        },
      ],
    },
  ]);
  const [likedUserIds, setLikedUserIds] = useState<string[]>([]);
  const [passedUserIds, setPassedUserIds] = useState<string[]>([]);

  const availableUsers = useMemo(() => {
    const matchedIds = matches.map((m) => m.user.id);
    let filtered = users.filter(
      (u) =>
        !matchedIds.includes(u.id) &&
        !likedUserIds.includes(u.id) &&
        !passedUserIds.includes(u.id)
    );

    if (isVIP && maxDistance) {
      filtered = filtered.filter(
        (u) => !u.distanceInMiles || u.distanceInMiles <= maxDistance
      );
      console.log(`VIP Distance Filter: Showing users within ${maxDistance} miles`);
    }

    return filtered;
  }, [users, matches, likedUserIds, passedUserIds, isVIP, maxDistance]);

  const likeUser = useCallback((userId: string) => {
    if (dailyLimitEnabled && dailyLikesRemaining <= 0) {
      return false;
    }

    setLikedUserIds((prev) => [...prev, userId]);
    if (dailyLimitEnabled) {
      setDailyLikesRemaining((prev) => Math.max(0, prev - 1));
    }
    
    const user = users.find((u) => u.id === userId);
    if (user) {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        user,
        matchedAt: new Date(),
        compatibility: Math.floor(Math.random() * 15) + 80,
      };
      setMatches((prev) => [...prev, newMatch]);
      setChats((prev) => [...prev, { matchId: newMatch.id, messages: [] }]);
    }
    return true;
  }, [dailyLimitEnabled, dailyLikesRemaining, users]);

  const passUser = useCallback((userId: string) => {
    setPassedUserIds((prev) => [...prev, userId]);
  }, []);

  const sendMessage = useCallback((matchId: string, text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text,
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.matchId === matchId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, lastMessage: newMessage } : match
      )
    );
  }, []);

  const getChat = useCallback((matchId: string) => {
    return chats.find((c) => c.matchId === matchId);
  }, [chats]);

  return {
    users,
    matches,
    availableUsers,
    likeUser,
    passUser,
    sendMessage,
    getChat,
    currentUserId,
    dailyLikesRemaining,
    dailyLimitEnabled,
  };
});
