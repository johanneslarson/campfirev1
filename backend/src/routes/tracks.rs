use actix_web::{get, web, HttpResponse, Responder, Error};
use actix_files::NamedFile;
use std::path::PathBuf;
use crate::models::{AppState, Track};
use uuid::Uuid;
use log::{error, info};

/// Get all tracks
#[get("/tracks")]
pub async fn get_all_tracks(data: web::Data<AppState>) -> impl Responder {
    let tracks = &data.track_collection.tracks;
    HttpResponse::Ok().json(tracks)
}

/// Get tracks by artist
#[get("/artists/{artist_id}/tracks")]
pub async fn get_tracks_by_artist(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let artist_id = path.into_inner();
    
    // Parse the UUID
    let artist_id = match Uuid::parse_str(&artist_id) {
        Ok(id) => id,
        Err(_) => {
            error!("Invalid artist ID format");
            return HttpResponse::BadRequest().body("Invalid artist ID format");
        }
    };
    
    let tracks: Vec<&Track> = data.track_collection.tracks
        .iter()
        .filter(|track| track.artist_id == artist_id)
        .collect();
    
    HttpResponse::Ok().json(tracks)
}

/// Get all artists
#[get("/artists")]
pub async fn get_all_artists(data: web::Data<AppState>) -> impl Responder {
    let artists = &data.track_collection.artists;
    HttpResponse::Ok().json(artists)
}

/// Get artist by ID
#[get("/artists/{artist_id}")]
pub async fn get_artist_by_id(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let artist_id = path.into_inner();
    
    // Parse the UUID
    let artist_id = match Uuid::parse_str(&artist_id) {
        Ok(id) => id,
        Err(_) => {
            error!("Invalid artist ID format");
            return HttpResponse::BadRequest().body("Invalid artist ID format");
        }
    };
    
    let artist = data.track_collection.artists
        .iter()
        .find(|a| a.id == artist_id);
    
    match artist {
        Some(artist) => HttpResponse::Ok().json(artist),
        None => HttpResponse::NotFound().body("Artist not found"),
    }
}

/// Get track by ID
#[get("/tracks/{track_id}")]
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

/// Configure routes for the track API
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all_tracks)
       .service(get_track_by_id)
       .service(get_all_artists)
       .service(get_artist_by_id)
       .service(get_tracks_by_artist);
} 