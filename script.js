const SUPABASE_URL = "https://bgbsqxfbdcvbqtnoigtp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnYnNxeGZiZGN2YnF0bm9pZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODE4NDIsImV4cCI6MjA5Njc1Nzg0Mn0.EGpD0mgYDrfNvPeVhDLPK6iKGxMHQdVRnQC5tXT49_g";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const world = document.querySelector("#world");
const form = document.querySelector("#entryForm");
const input = document.querySelector("#entryInput");

async function loadEntries() {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Load error:", error);
    return;
  }

  data.forEach(createFloatingText);
}

function createFloatingText(entry) {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = entry.text;

  el.style.left = `${entry.x}vw`;
  el.style.top = `${entry.y}vh`;
  el.style.fontSize = `${entry.size}px`;
  el.style.animationDuration = `${entry.speed}s`;
  el.style.animationDelay = `${Math.random() * -10}s`;

  const date = new Date(entry.created_at);
  el.dataset.time = `recorded on ${date.toLocaleString()}`;

  world.appendChild(el);
}

function randomEntryData(text) {
  return {
    text,
    x: Math.random() * 80 + 5,
    y: Math.random() * 70 + 8,
    size: Math.random() * 20 + 14,
    speed: Math.random() * 8 + 5
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  const newEntry = randomEntryData(text);

  const { data, error } = await db
    .from("entries")
    .insert(newEntry)
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return;
  }

  createFloatingText(data);
});

loadEntries();