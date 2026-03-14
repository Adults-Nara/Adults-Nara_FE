export type AdState = 'IDLE' | 'FETCHING' | 'PLAYING' | 'COMPLETED_OR_SKIPPED';

// GET /api/v1/ads?videoId={videoId} 응답
export interface AdResponse {
  videoId: number;
}
