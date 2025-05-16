use crate::models::{Artist, Track, TrackCollection};
use std::path::{Path, PathBuf};
use uuid::Uuid;
use walkdir::WalkDir;
use std::collections::HashMap;
use log::{info, error};
use std::fs;
use thiserror::Error;
<<<<<<< HEAD
use serde::Deserialize;
=======
>>>>>>> bcfb49d84db7311ca1b67b767e5824c63f1f33e8

#[derive(Error, Debug)]
pub enum TrackServiceError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Path error: {0}")]
    InvalidPath(String),
<<<<<<< HEAD
    
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

#[derive(Deserialize)]
struct ArtistMetadata {
    name: String,
    bio: String,
    instagram: Option<String>,
    image_url: Option<String>,
=======
>>>>>>> bcfb49d84db7311ca1b67b767e5824c63f1f33e8
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
        let mut artist_map: HashMap<String, Uuid> = HashMap::new();
        
        // Make sure the base path exists
        if !self.base_path.exists() {
            error!("Base path doesn't exist: {:?}", self.base_path);
            return Err(TrackServiceError::InvalidPath(
                self.base_path.to_string_lossy().to_string()
            ));
        }
        
<<<<<<< HEAD
=======
        // Create predefined artists
        let hans_id = Uuid::new_v4();
        let patrick_id = Uuid::new_v4();
        let sym1_id = Uuid::new_v4();
        let kiyan_id = Uuid::new_v4();
        
        // Add predefined artists
        artists.push(Artist {
            id: hans_id,
            name: "Hans Larson Trio".to_string(),
            bio: "A dynamic jazz trio exploring new musical horizons with innovative compositions and improvisation.".to_string(),
        });
        
        artists.push(Artist {
            id: patrick_id,
            name: "Patrick Amunson".to_string(),
            bio: "A versatile musician bringing soulful melodies and rhythmic innovation to contemporary music.".to_string(),
        });
        
        artists.push(Artist {
            id: sym1_id,
            name: "SYM1".to_string(),
            bio: "An electronic music producer crafting immersive soundscapes and cutting-edge beats.".to_string(),
        });
        
        artists.push(Artist {
            id: kiyan_id,
            name: "Kiyan Saifi".to_string(),
            bio: "Kiyan Saifi is an experimental guitarist who currently performs with DC-based bands: Red Sunflower, Opposite Tiger, Fateful Encounter, Sense Memory, as well as in a duo with his brother Teymour Saifi.".to_string(),
        });
        
        // Map artist directory names to their IDs
        artist_map.insert("HansLarsonTrio".to_string(), hans_id);
        artist_map.insert("PatrickAmunson".to_string(), patrick_id);
        artist_map.insert("SYM1".to_string(), sym1_id);
        artist_map.insert("KiyanSaifi".to_string(), kiyan_id);
        // For paths with spaces (if they exist)
        artist_map.insert("Hans Larson Trio".to_string(), hans_id);
        artist_map.insert("Patrick Amunson".to_string(), patrick_id);
        artist_map.insert("Kiyan Saifi".to_string(), kiyan_id);
        
        // Map nice names to IDs for lookups
        let name_to_id: HashMap<String, Uuid> = [
            ("Hans Larson Trio".to_string(), hans_id),
            ("PatrickAmunson".to_string(), patrick_id),
            ("Patrick Amunson".to_string(), patrick_id),
            ("SYM1".to_string(), sym1_id),
            ("Fireye".to_string(), patrick_id), // Special case: Fireye is a Patrick Amunson project
            ("Kiyan Saifi".to_string(), kiyan_id),
            ("KiyanSaifi".to_string(), kiyan_id),
        ].into_iter().collect();
        
>>>>>>> bcfb49d84db7311ca1b67b767e5824c63f1f33e8
        // Iterate over artist directories
        for entry in fs::read_dir(&self.base_path)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                let artist_dir_name = path.file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("Unknown Artist");
                
<<<<<<< HEAD
                info!("Found artist directory: {} at {:?}", artist_dir_name, path);
                
                // Try to read the metadata.json file if it exists
                let metadata_path = path.join("metadata.json");
                let artist_id = Uuid::new_v4();
                
                info!("Looking for metadata at: {:?}, exists: {}", metadata_path, metadata_path.exists());
                
                let (artist_name, artist_bio, instagram, image_url) = if metadata_path.exists() {
                    // Read and parse the metadata file
                    info!("Found metadata.json for {}", artist_dir_name);
                    let metadata_content = match fs::read_to_string(&metadata_path) {
                        Ok(content) => content,
                        Err(e) => {
                            error!("Error reading metadata.json for {}: {}", artist_dir_name, e);
                            continue;
                        }
                    };
                    info!("Metadata content: {}", metadata_content);
                    
                    let metadata: ArtistMetadata = match serde_json::from_str(&metadata_content) {
                        Ok(meta) => {
                            info!("Successfully parsed metadata for {}", artist_dir_name);
                            meta
                        },
                        Err(e) => {
                            error!("Error parsing metadata.json for {}: {}", artist_dir_name, e);
                            continue;
                        }
                    };
                    
                    (
                        metadata.name,
                        metadata.bio,
                        metadata.instagram,
                        metadata.image_url
                    )
                } else {
                    info!("No metadata.json found for {}, using defaults", artist_dir_name);
                    // Get the display name for this artist
                    let display_name = match artist_dir_name {
=======
                // Find the artist ID for this directory
                let artist_id = artist_map.get(artist_dir_name).cloned();
                
                if let Some(artist_id) = artist_id {
                    // Get the display name for this artist
                    let artist_display_name = match artist_dir_name {
>>>>>>> bcfb49d84db7311ca1b67b767e5824c63f1f33e8
                        "HansLarsonTrio" => "Hans Larson Trio".to_string(),
                        "PatrickAmunson" => "Patrick Amunson".to_string(),
                        "SYM1" => "SYM1".to_string(),
                        "KiyanSaifi" => "Kiyan Saifi".to_string(),
<<<<<<< HEAD
                        "MadFrances" => "MadFrances".to_string(),
                        "SadieHabas" => "Sadie Habas".to_string(),
                        _ => artist_dir_name.to_string(),
                    };
                    
                    // Default bio based on the artist
                    let bio = match artist_dir_name {
                        "HansLarsonTrio" => "A dynamic jazz trio exploring new musical horizons with innovative compositions and improvisation.".to_string(),
                        "PatrickAmunson" => "A versatile musician bringing soulful melodies and rhythmic innovation to contemporary music.".to_string(),
                        "SYM1" => "An electronic music producer crafting immersive soundscapes and cutting-edge beats.".to_string(),
                        "KiyanSaifi" => "Kiyan Saifi is an experimental guitarist who currently performs with DC-based bands: Red Sunflower, Opposite Tiger, Fateful Encounter, Sense Memory, as well as in a duo with his brother Teymour Saifi.".to_string(),
                        "MadFrances" => "Madeleine F Lyu (MadFrances) is a drummer, songwriter, and multi-instrumentalist from Portland Oregon.".to_string(),
                        "SadieHabas" => "Sadie Habas is a vocalist, arts advocate, and 2025 graduate of Boston University, where she earned a Bachelor of Music in Vocal Performance with a Minor in Political Science.".to_string(),
                        _ => "".to_string(),
                    };
                    
                    // Default Instagram handles
                    let instagram = match artist_dir_name {
                        "KiyanSaifi" => Some("kiyansaifi".to_string()),
                        "SYM1" => Some("no1butsym1".to_string()),
                        "MadFrances" => Some("madfrances".to_string()),
                        "SadieHabas" => Some("sadiehabas_".to_string()),
                        _ => None,
                    };
                    
                    (display_name, bio, instagram, None)
                };
                
                // Create artist entry
                let artist = Artist {
                    id: artist_id,
                    name: artist_name,
                    bio: artist_bio,
                    instagram,
                    image_url,
                };
                
                // Add artist to collection
                artists.push(artist.clone());
                
                // Map directory name to ID
                artist_map.insert(artist_dir_name.to_string(), artist_id);
                
                // Scan for tracks in this artist's directory
                for track_entry in WalkDir::new(&path).max_depth(1).into_iter().filter_map(Result::ok) {
                    let track_path = track_entry.path();
                    
                    // Skip the metadata file
                    if track_path.file_name().and_then(|n| n.to_str()) == Some("metadata.json") {
                        continue;
                    }
                    
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
                                    (title.to_string(), artist.name.clone())
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
                                
                                // Determine genre based on artist
                                let genre = match artist_dir_name {
                                    "HansLarsonTrio" => {
                                        if title.contains("Touch Earth") {
                                            "Jazz Fusion".to_string()
                                        } else {
                                            "Jazz".to_string()
                                        }
                                    },
                                    "PatrickAmunson" => {
                                        if performing_artist == "Fireye" || title.contains("Rush") {
                                            "Electronic".to_string()
                                        } else {
                                            "Pop/Rock".to_string()
                                        }
                                    },
                                    "SYM1" => "R&B".to_string(),
                                    "KiyanSaifi" => "Electronic".to_string(),
                                    "MadFrances" => "Indie Rock".to_string(),
                                    "SadieHabas" => "Indie Pop".to_string(),
                                    _ => "Other".to_string(),
                                };
                                
                                // Create track entry
                                let track = Track {
                                    id: Uuid::new_v4(),
                                    title,
                                    artist_id: artist_id,
                                    artist_name: performing_artist,
                                    genre,
                                    url,
                                    file_type: extension.to_string(),
                                };
                                
                                tracks.push(track);
=======
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
                                        "HansLarsonTrio" => {
                                            if title.contains("Touch Earth") {
                                                "Jazz Fusion".to_string()
                                            } else {
                                                "Jazz".to_string()
                                            }
                                        },
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
                                    let track_artist_id = name_to_id.get(&performing_artist)
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
>>>>>>> bcfb49d84db7311ca1b67b767e5824c63f1f33e8
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