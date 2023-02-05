export interface CommentPayload {
  text: string;
  postId: string;
  responseId?: string;
  username: string;
  groupId: string;
}
