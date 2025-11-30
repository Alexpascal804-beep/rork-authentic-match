import { User, Match } from "@/types";

export const currentUserId = "current-user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Emma",
    age: 27,
    bio: "Adventure seeker and coffee enthusiast. Looking for someone who can keep up with spontaneous road trips and deep conversations.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=400",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400",
    ],
    prompts: [
      {
        question: "My simple pleasures",
        answer: "Sunday morning farmers markets, trying new coffee shops, and getting lost in a good book",
      },
      {
        question: "Best travel story",
        answer: "Got stranded in Iceland for 3 extra days due to a storm. Best accident ever - made lifelong friends at a local pub!",
      },
    ],
    interests: ["Travel", "Coffee", "Reading", "Hiking", "Photography"],
    location: "San Francisco, CA",
    verified: true,
    occupation: "UX Designer",
    education: "Stanford University",
    distanceInMiles: 12,
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    bio: "Foodie by day, amateur chef by night. Believe the best conversations happen over a good meal.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    ],
    prompts: [
      {
        question: "I'm looking for",
        answer: "Someone who appreciates a perfectly cooked meal and doesn't mind my experimental cooking phases",
      },
      {
        question: "My most controversial opinion",
        answer: "Pineapple on pizza is actually amazing and people need to be more open-minded",
      },
    ],
    interests: ["Cooking", "Wine Tasting", "Restaurants", "Travel", "Fitness"],
    location: "San Francisco, CA",
    verified: true,
    occupation: "Software Engineer",
    education: "UC Berkeley",
    distanceInMiles: 8,
  },
  {
    id: "3",
    name: "Sofia",
    age: 25,
    bio: "Yoga instructor with a passion for wellness and mindful living. Finding balance between ambition and zen.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    ],
    prompts: [
      {
        question: "A perfect Sunday",
        answer: "Morning yoga session, brunch with friends, afternoon at the beach, and ending with a sunset meditation",
      },
      {
        question: "Green flags I look for",
        answer: "Good communication, emotional intelligence, and someone who's working on themselves",
      },
    ],
    interests: ["Yoga", "Meditation", "Health", "Nature", "Surfing"],
    location: "San Francisco, CA",
    verified: true,
    occupation: "Yoga Instructor",
    distanceInMiles: 35,
  },
  {
    id: "4",
    name: "Marcus",
    age: 31,
    bio: "Architect who loves creating spaces and experiences. Weekends are for exploring hidden gems in the city or escaping to nature.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
    ],
    prompts: [
      {
        question: "Typical Friday night",
        answer: "Either checking out a new art exhibit or finding the best live music spot in the city",
      },
      {
        question: "I'm weirdly attracted to",
        answer: "People who can explain complex things simply and have strong opinions about design",
      },
    ],
    interests: ["Architecture", "Art", "Music", "Design", "Urban Exploring"],
    location: "San Francisco, CA",
    verified: true,
    occupation: "Architect",
    education: "MIT",
    distanceInMiles: 45,
  },
  {
    id: "5",
    name: "Lily",
    age: 26,
    bio: "Veterinarian with a soft spot for rescue animals. Looking for someone who understands why I have 3 dogs and 2 cats.",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400",
    ],
    prompts: [
      {
        question: "I'll know I found the one when",
        answer: "My dogs approve and they're all fighting to sit on their lap",
      },
      {
        question: "Biggest risk I've taken",
        answer: "Left a corporate job to pursue veterinary medicine. Best decision I ever made!",
      },
    ],
    interests: ["Animals", "Hiking", "Volunteering", "Baking", "Camping"],
    location: "San Francisco, CA",
    verified: true,
    occupation: "Veterinarian",
    distanceInMiles: 22,
  },
];

export const mockMatches: Match[] = [
  {
    id: "match-1",
    user: mockUsers[1],
    matchedAt: new Date(Date.now() - 86400000 * 2),
    compatibility: 92,
    lastMessage: {
      id: "msg-1",
      senderId: "2",
      text: "That restaurant recommendation was perfect! We should go together next time 😊",
      timestamp: new Date(Date.now() - 3600000 * 2),
    },
  },
  {
    id: "match-2",
    user: mockUsers[2],
    matchedAt: new Date(Date.now() - 86400000),
    compatibility: 88,
    lastMessage: {
      id: "msg-2",
      senderId: currentUserId,
      text: "I'd love to join your yoga class sometime!",
      timestamp: new Date(Date.now() - 3600000 * 5),
    },
  },
  {
    id: "match-3",
    user: mockUsers[4],
    matchedAt: new Date(Date.now() - 3600000 * 3),
    compatibility: 85,
  },
];
