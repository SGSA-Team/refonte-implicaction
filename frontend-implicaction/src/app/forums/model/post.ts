export interface Post {
  id?: number;
  name?: string;
  url?: string;
  description?: string;
  voteCount?: number;
  username?: string;
  userId?: string;
  userImageUrl?: string;
  groupId?: number;
  groupName?: string;
  commentCount?: number;
  duration?: string;
  upVote?: boolean;
  downVote?: boolean;
}
