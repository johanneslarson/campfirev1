use crate::models::{Artist, Track, TrackCollection};
use std::path::{Path, PathBuf};
use uuid::Uuid;
use walkdir::WalkDir;
use std::collections::HashMap;
use log::{info, error};
use std::fs;
use thiserror::Error;
use serde::Deserialize;

#[derive(Error, Debug)]
pub enum TrackServiceError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Path error: {0}")]
    InvalidPath(String),
    
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

#[derive(Deserialize)]
struct ArtistMetadata {
    name: String,
    bio: String,
    instagram: Option<String>,
    image_url: Option<String>,
}

/// Service for managing tracks
pub struct TrackService {
    /// Base path for all track assets
    pub base_path: PathBuf,
    /// Public URL prefix for serving tracks
    pub url_prefix: String,
}

impl TrackService {
    pub fn new<P: AsRef<Path>>(base_path: P, url_prefix: &str) -> Self {
        Self {
            base_path: base_path.as_ref().to_path_buf(),
            url_prefix: url_prefix.to_string(),
        }
    }
    
    /// Scan the track directories and build the collection
    pub fn scan_tracks(&self) -> Result<TrackCollection, TrackServiceError> {
        info!("Scanning for tracks in: {:?}", self.base_path);
        
        let mut artists = Vec::new();
        let mut tracks = Vec::new();
        let mut artist_map = HashMap::new();
        
        // Make sure the base path exists
        if !self.base_path.exists() {
            error!("Base path doesn't exist: {:?}", self.base_path);
            return Err(TrackServiceError::InvalidPath(
                self.base_path.to_string_lossy().to_string()
            ));
        }
        
        // Create predefined artists
        let sym1_id = Uuid::parse_str("2beb8103-14fe-4fb6-98ab-0d98bfaa2f71").unwrap();
        let patrick_id = Uuid::parse_str("d701e009-be8b-4a0d-bd79-0167d1d37cb1").unwrap();
        let kiyan_id = Uuid::parse_str("cf23d5a5-ca63-4f2c-8309-338e96770e90").unwrap();
        let sadie_id = Uuid::parse_str("61ddcd11-0c13-46b0-872e-51517d66caea").unwrap();
        let madfrances_id = Uuid::parse_str("1af3af1d-d849-4ee3-890c-154353e58fdf").unwrap();

        artist_map.insert("SYM1".to_string(), sym1_id);
        artist_map.insert("Patrick Amunson".to_string(), patrick_id);
        artist_map.insert("Kiyan Saifi".to_string(), kiyan_id);
        artist_map.insert("Sadie Habas".to_string(), sadie_id);
        artist_map.insert("MadFrances".to_string(), madfrances_id);

        let artists = vec![
            ("SYM1".to_string(), sym1_id),
            ("Patrick Amunson".to_string(), patrick_id),
            ("Kiyan Saifi".to_string(), kiyan_id),
            ("Sadie Habas".to_string(), sadie_id),
            ("MadFrances".to_string(), madfrances_id),
        ];
        
        // Iterate over artist directories
        for entry in fs::read_dir(&self.base_path)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                let artist_dir_name = path.file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("Unknown Artist");
                
                // Find the artist ID for this directory
                let artist_id = artist_map.get(artist_dir_name).cloned();
                
                if let Some(artist_id) = artist_id {
                    // Get the display name for this artist
                    let artist_display_name = match artist_dir_name {
                        "SYM1" => "SYM1".to_string(),
                        "PatrickAmunson" => "Patrick Amunson".to_string(),
                        "KiyanSaifi" => "Kiyan Saifi".to_string(),
                        "SadieHabas" => "Sadie Habas".to_string(),
                        "madfrances" => "MadFrances".to_string(),
                        _ => artist_dir_name.to_string(),
                    };
                    
                    // Scan for tracks in this artist's directory
                    for track_entry in WalkDir::new(&path).max_depth(1).into_iter().filter_map(Result::ok) {
                        let track_path = track_entry.path();
                        
                        if track_path.is_file() {
                            if let Some(extension) = track_path.extension().and_then(|e| e.to_str()) {
                                if extension == "mp3" || extension == "m4a" || extension == "wav" {
                                    // Extract track title from filename
                                    let file_name = track_path.file_name()
                                        .and_then(|n| n.to_str())
                                        .unwrap_or("Unknown Track");
                                    
                                    let (title, performing_artist) = if file_name.contains(" - ") {
                                        // Format is "Artist - Title.ext"
                                        let parts: Vec<&str> = file_name.splitn(2, " - ").collect();
                                        let artist_part = parts[0].trim();
                                        let title_part = parts[1].trim().trim_end_matches(&format!(".{}", extension));
                                        
                                        (title_part.to_string(), artist_part.to_string())
                                    } else {
                                        // Just use the filename without extension as title
                                        let title = file_name.trim_end_matches(&format!(".{}", extension));
                                        (title.to_string(), artist_display_name.clone())
                                    };
                                    
                                    // Build the URL (relative to the public folder)
                                    let relative_path = track_path.strip_prefix(&self.base_path)
                                        .map_err(|_| TrackServiceError::InvalidPath(
                                            track_path.to_string_lossy().to_string()
                                        ))?;
                                    
                                    let url = format!("{}/{}", 
                                        self.url_prefix.trim_end_matches('/'),
                                        relative_path.to_string_lossy()
                                    );
                                    
                                    // Special case for SYM1's track
                                    let title = if performing_artist == "SYM1" && title.contains("Right 1 4 Me Master") {
                                        "Right 1 4 Me".to_string()
                                    } else {
                                        title
                                    };
                                    
                                    // Determine genre based on artist and title
                                    let genre = match artist_dir_name {
                                        "PatrickAmunson" => {
                                            if performing_artist == "Fireye" || title.contains("Rush") {
                                                "Electronic".to_string()
                                            } else {
                                                "Pop/Rock".to_string()
                                            }
                                        },
                                        "SYM1" => "R&B".to_string(),
                                        "KiyanSaifi" => "Electronic".to_string(),
                                        _ => "Other".to_string(),
                                    };
                                    
                                    // Determine correct artist ID (for when a track is by a side project)
                                    let track_artist_id = artist_map.get(&performing_artist)
                                        .cloned()
                                        .unwrap_or(artist_id);
                                    
                                    // Create track entry
                                    let track = Track {
                                        id: Uuid::new_v4(),
                                        title,
                                        artist_id: track_artist_id,
                                        artist_name: performing_artist,
                                        genre,
                                        url,
                                        file_type: extension.to_string(),
                                    };
                                    
                                    tracks.push(track);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        info!("Found {} artists and {} tracks", artists.len(), tracks.len());
        Ok(TrackCollection { artists, tracks })
    }
} 