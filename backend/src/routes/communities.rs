use actix_web::{web, HttpResponse, Responder};
use uuid::Uuid;

use crate::models::{AppState, Community, ArtistSummary};

pub async fn get_communities(data: web::Data<AppState>) -> impl Responder {
    let all_artists = &data.track_collection.artists;
    
    // Filter artists for each community by name
    let twin_cities_artists: Vec<ArtistSummary> = all_artists.iter()
        .filter(|a| matches!(a.name.as_str(), "SYM1" | "Patrick Amunson" | "Hans Larson Trio"))
        .map(|a| ArtistSummary { id: a.id, name: a.name.clone() })
        .collect();
    
    let dmv_artists: Vec<ArtistSummary> = all_artists.iter()
        .filter(|a| a.name == "Kiyan Saifi")
        .map(|a| ArtistSummary { id: a.id, name: a.name.clone() })
        .collect();

    let communities = vec![
        Community { name: "Twin Cities".to_string(), artists: twin_cities_artists },
        Community { name: "DMV".to_string(), artists: dmv_artists },
    ];
    
    HttpResponse::Ok().json(communities)
} 