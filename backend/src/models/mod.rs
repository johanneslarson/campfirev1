use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Artist {
    pub id: Uuid,
    pub name: String,
    pub bio: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub id: Uuid,
    pub title: String,
    pub artist_id: Uuid,
    pub artist_name: String,
    pub genre: String,
    pub url: String,
    pub file_type: String,  // mp3, m4a, etc.
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackCollection {
    pub artists: Vec<Artist>,
    pub tracks: Vec<Track>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppState {
    pub track_collection: TrackCollection,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            track_collection: TrackCollection {
                artists: vec![],
                tracks: vec![],
            },
        }
    }
} 