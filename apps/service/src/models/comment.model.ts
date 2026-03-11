export interface CommentItemResponse {
  commentId: string;
  nickname: string;
  profileImageUrl: string;
  text: string;
  createdAt: string;
}

export interface MyCommentResponse {
  commentId: string;
  text: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPageResponse {
  comments: CommentItemResponse[];
  hasMore: boolean;
  myComment?: CommentItemResponse;
}

export interface CommentCreateRequest {
  text: string;
}

export interface CommentEditRequest {
  text: string;
}
