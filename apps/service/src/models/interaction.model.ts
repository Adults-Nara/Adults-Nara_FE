export type InteractionType = 'LIKE' | 'DISLIKE' | 'SUPERLIKE' | null;

export interface InteractionStatusResponse {
  interactionType: InteractionType;
}
