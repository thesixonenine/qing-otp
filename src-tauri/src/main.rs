// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    qing_otp_lib::run()
}

#[tauri::command]
fn save_otps(data: String) -> Result<(), String> {
  std::fs::write("otps.json", data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_otps() -> Result<String, String> {
  std::fs::read_to_string("otps.json")
    .or_else(|_| Ok(String::from("[]")))
}
