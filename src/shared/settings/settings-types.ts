// Shared Settings type — mirrors Rust Settings struct in src-tauri/src/core.rs
export type Settings = {
  theme: string;
  lang: string;
  fontFamily?: string | null;
  fontSize?: number | null;
};
