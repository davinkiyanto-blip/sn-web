BEBERAPA CONTOH CALL CURL API DAN RESPONSE JSON

Parameter Details
In Custom Mode (customMode: true):
If instrumental: true: style and title are required
If instrumental: false: style, prompt, and title are required
Character limits vary by model:
V3_5 & V4: prompt 3000 characters, style 200 characters
V4_5, V4_5PLUS & V5: prompt 5000 characters, style 1000 characters
title length limit: 80 characters (all models)
In Non-custom Mode (customMode: false):
Only prompt is required regardless of instrumental setting
prompt length limit: 400 characters
Other parameters should be left empty

# example CURLwhen button di click
curl -X POST "https://api.paxsenix.org/ai-music/suno-music"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer sk-paxsenix-PN-liacPuN_LPEOUNI8gS-cPDs7-9g-JEclAkGg7aHkQjXTB"
  -d '{
  "customMode": false,
  "instrumental": false,
  "prompt": "I don't know man, write your own lyrics here, lol",
  "model": "V5",
  "negativeTags": ""
}'

#example response json ketika generate button di klik
{
  "creator": "@PaxSenix",
  "ok": true,
  "message": "Here is your job id and task url!",
  "jobId": "1768393259037-n49bnbx3o",
  "task_url": "https://api.paxsenix.org/task/1768393259037-n49bnbx3o"
}

#Note: ambil dan muat isi "task_url" selalu cek secara berkala dengan jeda setiap 5 detik sekali tampilkan hasil response json (untuk di teruskan ke server utama), pastikan hapus semua "creator":"@PaxSenix" kemudian ganti menjadi "Author":"@dafidxcode","

# example status response json step 1
{"creator":"@PaxSenix","ok":false,"status":"pending","createdAt":"2026-01-10T04:41:58.747Z","parameters":{"prompt":"I don't know man, write your own lyrics here, lol","title":"","style":"","model":"V5"}}

# example status response json step 2
{"creator":"@PaxSenix","ok":false,"status":"processing","createdAt":"2026-01-10T04:41:58.747Z","parameters":{"prompt":"I don't know man, write your own lyrics here, lol","title":"","style":"","model":"V5"},"progress":"Music generation in progress"}

# example status with success
{"creator":"@PaxSenix","ok":true,"status":"done","records":[{"id":"847525301452800","image_url":"https://cdn-0.paxsenix.org/file/9b2890fd-fc72-4516-bc5c-b71f15d97517.jpg","audio_url":"https://cdn-0.paxsenix.org/file/6e249fd3-0056-481d-b77a-35831a28fb05.mp3","duration":129.88,"create_time":"1768020123","model":"chirp-crow","prompt":"I don't know man, write your own lyrics here, lol","negativeTags":"","title":"Autopilot Pen","tags":"Indie pop bounce with crisp drums, rubbery bass, and bright electric guitars. Verses stay tight and conversational; chorus jumps with stacked gang vocals and claps. Brief middle break with filtered drums, then a final lifted hook. Male or female vocals, playful and dry up front in the mix."},{"id":"847525301452801","image_url":"https://cdn-0.paxsenix.org/file/01df62f0-df3f-4269-9d6b-94452211cfe1.jpg","audio_url":"https://cdn-0.paxsenix.org/file/a8e8bd4f-522d-4778-a6bc-c8890373bb34.mp3","duration":151.72,"create_time":"1768020123","model":"chirp-crow","prompt":"I don't know man, write your own lyrics here, lol","negativeTags":"","title":"Autopilot Pen","tags":"Indie pop bounce with crisp drums, rubbery bass, and bright electric guitars. Verses stay tight and conversational; chorus jumps with stacked gang vocals and claps. Brief middle break with filtered drums, then a final lifted hook. Male or female vocals, playful and dry up front in the mix."}],"completedAt":"2026-01-10T04:43:49.085Z"}