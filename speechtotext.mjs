import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
  apiKey: '6953f82c3426417c8c103f2df9393594'
})

const audioFile = './speech.m4a'


const params = {
  audio: audioFile,
  speaker_labels: true
}

const run = async () => {
  const transcript = await client.transcripts.transcribe(params)

  if (transcript.status === 'error') {
    console.error(`Transcription failed: ${transcript.error}`)
    process.exit(1)
  }

  console.log(transcript.text)
  }

run()
