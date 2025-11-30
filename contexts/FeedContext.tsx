import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback } from "react";
import { Post, Comment, PostGift } from "@/types";
import { mockPosts } from "@/mocks/posts";
import { mockUsers, currentUserId } from "@/mocks/users";
import { GIFTS } from "@/constants/gifts";

export const [FeedProvider, useFeed] = createContextHook(() => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Comment[]>([]);

  const createPost = useCallback((content: string, imageUrl?: string) => {
    const currentUser = mockUsers.find((u) => u.id === currentUserId);
    if (!currentUser) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: currentUserId,
      user: currentUser,
      content,
      imageUrl,
      createdAt: new Date(),
      likes: [],
      commentCount: 0,
      giftCount: 0,
      gifts: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUserId);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== currentUserId)
              : [...post.likes, currentUserId],
          };
        }
        return post;
      })
    );
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    const currentUser = mockUsers.find((u) => u.id === currentUserId);
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUserId,
      user: currentUser,
      text,
      createdAt: new Date(),
    };

    setComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      )
    );
  }, []);

  const sendGift = useCallback((postId: string, giftId: string) => {
    const gift = GIFTS.find((g) => g.id === giftId);
    const currentUser = mockUsers.find((u) => u.id === currentUserId);
    if (!gift || !currentUser) return;

    const postGift: PostGift = {
      id: `post-gift-${Date.now()}`,
      postId,
      gift,
      senderId: currentUserId,
      sender: currentUser,
      createdAt: new Date(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              gifts: [...post.gifts, postGift],
              giftCount: post.giftCount + 1,
            }
          : post
      )
    );
  }, []);

  const getComments = useCallback((postId: string) => {
    return comments.filter((c) => c.postId === postId);
  }, [comments]);

  const getPost = useCallback((postId: string) => {
    return posts.find((p) => p.id === postId);
  }, [posts]);

  return {
    posts,
    createPost,
    likePost,
    addComment,
    sendGift,
    getComments,
    getPost,
  };
});
