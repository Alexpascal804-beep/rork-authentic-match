export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  prompts: Prompt[];
  interests: string[];
  location: string;
  verified: boolean;
  occupation?: string;
  education?: string;
  distanceInMiles?: number;
}

export interface Prompt {
  question: string;
  answer: string;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: Date;
  compatibility: number;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Chat {
  matchId: string;
  messages: Message[];
}

export interface LiveStream {
  id: string;
  broadcaster: User;
  title: string;
  startedAt: Date;
  viewerCount: number;
  isLive: boolean;
  thumbnailUrl?: string;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  currency: string;
  animation?: string;
}

export interface GiftTransaction {
  id: string;
  giftId: string;
  senderId: string;
  recipientId: string;
  streamId: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: string[];
  commentCount: number;
  giftCount: number;
  gifts: PostGift[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: Date;
}

export interface PostGift {
  id: string;
  postId: string;
  gift: Gift;
  senderId: string;
  sender: User;
  createdAt: Date;
}
