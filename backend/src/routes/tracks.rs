use actix_web::{web, HttpResponse, Responder, Error};
use actix_files::NamedFile;
use std::path::PathBuf;
use crate::models::AppState;
use uuid::Uuid;
use log::{error, info};

/// Get all tracks
pub async fn get_all_tracks(data: web::Data<AppState>) -> impl Responder {
    let tracks = &data.track_collection.tracks;
    HttpResponse::Ok().json(tracks)
}

/// Get track by ID
pub async fn get_track_by_id(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let track_id = path.into_inner();
    
    // Parse the UUID
    let track_id = match Uuid::parse_str(&track_id) {
        Ok(id) => id,
        Err(_) => {
            error!("Invalid track ID format");
            return HttpResponse::BadRequest().body("Invalid track ID format");
        }
    };
    
    let track = data.track_collection.tracks
        .iter()
        .find(|t| t.id == track_id);
    
    match track {
        Some(track) => HttpResponse::Ok().json(track),
        None => HttpResponse::NotFound().body("Track not found"),
    }
}

/// Serve a track audio file
pub async fn serve_track_file(
    path: web::Path<(String, String)>,
) -> Result<NamedFile, Error> {
    let (artist, filename) = path.into_inner();
    
    info!("Serving track file: {}/{}", artist, filename);
    
    let filepath = PathBuf::from("assets/tracks")
        .join(artist)
        .join(filename);
    
    Ok(NamedFile::open(filepath)?)
}

// Configure routes for the track API - Removed this function as routes are defined in main.rs
/*
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all_tracks)
       .service(get_track_by_id)
       .service(get_all_artists) // These were removed
       .service(get_artist_by_id) // These were removed
       .service(get_tracks_by_artist); // These were removed
}
*/ 