import { AssemblyAI } from 'assemblyai'
const result = dotenv.config();
console.log("Hi" + result.parced);
const API_KEY = ASSEMBLYAI_API_KEY; 
console.log(API_KEY);

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
