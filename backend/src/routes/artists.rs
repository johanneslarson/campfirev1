use actix_web::{web, HttpResponse, Responder};
use uuid::Uuid;

use crate::models::{AppState, Artist, Track};

// Handler to get all artists
pub async fn get_all(data: web::Data<AppState>) -> impl Responder {
    let artists = &data.track_collection.artists;
    HttpResponse::Ok().json(artists)
}

// Handler to get a specific artist by ID
pub async fn get_by_id(path: web::Path<Uuid>, data: web::Data<AppState>) -> impl Responder {
    let artist_id = path.into_inner();
    let artist = data.track_collection.artists.iter().find(|a| a.id == artist_id);

    match artist {
        Some(a) => HttpResponse::Ok().json(a),
        None => HttpResponse::NotFound().body("Artist not found"),
    }
}

// Handler to get tracks by a specific artist ID
pub async fn get_tracks(path: web::Path<Uuid>, data: web::Data<AppState>) -> impl Responder {
    let artist_id = path.into_inner();
    let tracks: Vec<&Track> = data.track_collection.tracks.iter()
        .filter(|t| t.artist_id == artist_id)
        .collect();

    if tracks.is_empty() {
        // Check if artist exists even if they have no tracks
        if data.track_collection.artists.iter().any(|a| a.id == artist_id) {
             HttpResponse::Ok().json(Vec::<Track>::new()) // Return empty list if artist exists but has no tracks
        } else {
            HttpResponse::NotFound().body("Artist not found")
        }
    } else {
        HttpResponse::Ok().json(tracks)
    }
} 