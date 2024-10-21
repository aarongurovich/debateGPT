import { AssemblyAI } from 'assemblyai'
//const result = dotenv.config();
//console.log(result.parced);
const API_KEY = "f6cfe0309246405b8466c6b75d2b1e55"; 

const client = new AssemblyAI({
  apiKey: API_KEY//my key rn
})

//audioSrc originally called audioUrl if thats a problem
const audioSrc = "https://assembly.ai/sports_injuries.mp3" //URL
//const audioSrc = "./audio.mp3"; // Filepath

const config = {
  audio_url: audioSrc
}

const run = async () => {
  console.log("Loading...")
  const transcript = await client.transcripts.transcribe(config)
  console.log(transcript.text)
}

run()
