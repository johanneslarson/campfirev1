use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer, HttpResponse, http::header};
use actix_files::Files;
use std::path::PathBuf;
use log::{info, error};

mod models;
mod services;
mod routes;

use models::AppState;
use services::track_service::TrackService;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // Setup assets path
    let assets_path = PathBuf::from("assets");
    if !assets_path.exists() {
        let cwd = std::env::current_dir()?;
        error!("Assets directory not found at {:?}, current working directory is {:?}", assets_path, cwd);
        return Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Assets directory not found"));
    }
    
    // Setup track service
    let track_service = TrackService::new(
        assets_path.join("tracks"), 
        "/api/assets/tracks"
    );
    
    // Scan for tracks
    let track_collection = match track_service.scan_tracks() {
        Ok(collection) => {
            info!("Loaded {} artists and {} tracks", 
                   collection.artists.len(), 
                   collection.tracks.len());
            collection
        },
        Err(err) => {
            error!("Failed to scan tracks: {:?}", err);
            return Err(std::io::Error::new(std::io::ErrorKind::Other, 
                                         format!("Failed to scan tracks: {}", err)));
        }
    };
    
    // Create app state with track collection
    let app_state = web::Data::new(AppState {
        track_collection
    });
    
    // Setup HTTP server
    info!("Starting HTTP server at http://localhost:8080");
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:3001")
            .allowed_origin("http://localhost:3002")
            .allowed_origin("http://localhost:3003")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE])
            .max_age(3600);
        
        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .app_data(app_state.clone())
            
            // API Routes
            .service(web::scope("/api")
                .configure(routes::tracks::configure)
                .service(
                    // Serve audio files via the API
                    web::scope("/assets")
                        .service(web::resource("/tracks/{artist}/{filename}")
                            .route(web::get().to(routes::tracks::serve_track_file))
                        )
                )
            )
            
            // Serve static files from assets directory
            .service(
                Files::new("/assets", assets_path.clone())
                    .show_files_listing()
                    .use_last_modified(true)
            )
            
            // Default route - return 404
            .default_service(
                web::route().to(|| async {
                    HttpResponse::NotFound().body("Not Found")
                })
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
