import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import { LiveStream, GiftTransaction, User } from "@/types";
import { mockUsers } from "@/mocks/users";

export const [LiveStreamProvider, useLiveStream] = createContextHook(() => {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [giftTransactions, setGiftTransactions] = useState<GiftTransaction[]>([]);

  useEffect(() => {
    loadLiveStreams();
  }, []);

  const loadLiveStreams = () => {
    const mockStreams: LiveStream[] = [
      {
        id: "stream-1",
        broadcaster: mockUsers[0],
        title: "Coffee chat and getting to know you ☕",
        startedAt: new Date(Date.now() - 1800000),
        viewerCount: Math.floor(Math.random() * 200) + 50,
        isLive: true,
        thumbnailUrl: mockUsers[0].photos[0],
      },
      {
        id: "stream-2",
        broadcaster: mockUsers[1],
        title: "Cooking my favorite pasta recipe 🍝",
        startedAt: new Date(Date.now() - 3600000),
        viewerCount: Math.floor(Math.random() * 300) + 100,
        isLive: true,
        thumbnailUrl: mockUsers[1].photos[0],
      },
      {
        id: "stream-3",
        broadcaster: mockUsers[2],
        title: "Morning yoga session 🧘‍♀️",
        startedAt: new Date(Date.now() - 900000),
        viewerCount: Math.floor(Math.random() * 150) + 30,
        isLive: true,
        thumbnailUrl: mockUsers[2].photos[0],
      },
      {
        id: "stream-4",
        broadcaster: mockUsers[3],
        title: "Tour of my latest architecture project",
        startedAt: new Date(Date.now() - 2700000),
        viewerCount: Math.floor(Math.random() * 100) + 20,
        isLive: true,
        thumbnailUrl: mockUsers[3].photos[0],
      },
    ];

    setLiveStreams(mockStreams);
  };

  const startStream = (title: string, broadcaster: User) => {
    const newStream: LiveStream = {
      id: `stream-${Date.now()}`,
      broadcaster,
      title,
      startedAt: new Date(),
      viewerCount: 0,
      isLive: true,
    };

    setCurrentStream(newStream);
    setIsStreaming(true);
    setLiveStreams((prev) => [newStream, ...prev]);
  };

  const endStream = () => {
    if (currentStream) {
      setLiveStreams((prev) =>
        prev.map((s) =>
          s.id === currentStream.id ? { ...s, isLive: false } : s
        )
      );
    }
    setCurrentStream(null);
    setIsStreaming(false);
  };

  const joinStream = (stream: LiveStream) => {
    setCurrentStream(stream);
    setLiveStreams((prev) =>
      prev.map((s) =>
        s.id === stream.id ? { ...s, viewerCount: s.viewerCount + 1 } : s
      )
    );
  };

  const leaveStream = () => {
    if (currentStream) {
      setLiveStreams((prev) =>
        prev.map((s) =>
          s.id === currentStream.id
            ? { ...s, viewerCount: Math.max(0, s.viewerCount - 1) }
            : s
        )
      );
    }
    setCurrentStream(null);
  };

  const sendGift = (
    giftId: string,
    senderId: string,
    recipientId: string,
    streamId: string
  ) => {
    const transaction: GiftTransaction = {
      id: `gift-${Date.now()}`,
      giftId,
      senderId,
      recipientId,
      streamId,
      timestamp: new Date(),
    };

    setGiftTransactions((prev) => [transaction, ...prev]);

    return transaction;
  };

  const getStreamGifts = (streamId: string) => {
    return giftTransactions.filter((t) => t.streamId === streamId);
  };

  return {
    liveStreams,
    currentStream,
    isStreaming,
    giftTransactions,
    startStream,
    endStream,
    joinStream,
    leaveStream,
    sendGift,
    getStreamGifts,
    refreshStreams: loadLiveStreams,
  };
});
