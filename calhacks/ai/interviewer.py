import os
import time
from groq import Groq
from openai import OpenAI
from hume import HumeBatchClient
from hume.models.config import FaceConfig, ProsodyConfig
from dotenv import load_dotenv, dotenv_values 


class Interviewer:
  def __init__(self):
    # Initialize any necessary variables or resources here
    load_dotenv()
    print(os.getenv("OPENAI_API_KEY"))
    self.open_ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    self.gorq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    self.hume_client = HumeBatchClient(os.getenv("HUME_API_KEY"))

  
  def get_text_from_audio(self, audio) -> str:
    input_text = self.gorq_client.audio.transcriptions.create(
      file=("sample_audio.m4a", audio),
      model="whisper-large-v3",
      prompt="I am answering a interview question",  # Optional
      response_format="json",  # Optional
      language="en",  # Optional
      temperature=0.0  # Optional
    )
    print("input_text: ", input_text.text)
    return input_text.text


  def get_response_from_gpt(self, prompt) -> str:
    response = self.open_ai_client.chat.completions.create(
        model="gpt-4o",
        messages= prompt,
        n = 1,
        seed=0
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content
  
  def get_audio_from_response(self, response):
    # Implement the logic for the interview process here
    response = self.open_ai_client.audio.speech.create(
        model="tts-1",
        voice="echo",
        input=response
    )
    return response.iter_bytes()
  
  def speech_prosody_emotion_analysis(self, filebytes, result_path:str):
    """Perform Speech prosody emotion measurement with Hume client. Save the result as .json in the specifed position
       
      args:
        filebytes: the filebytes of the audio file to be analyzed
        result_path: the path and file name to store the emotion analysis result as .json
    """
    config = ProsodyConfig()
    job = self.hume_client.submit_job([], [config], filebytes=("sample audio", filebytes)) # need further change "tuple" to "list(tuples)"" when running batch analysis
    # print(job)
    # print("Running...")
    details = job.await_complete()
    job.download_predictions(result_path + ".json")
    # print("emotion_analysis done")
  
  # def run(self):
  #   input_text = self.get_text_from_audio()
  #   response = self.get_response_from_gpt(input_text)
  #   audio = self.get_audio_from_response(response)
  #   return audio

if __name__ == "__main__":
  start_time = time.time()
  audio = open("sample_audio.m4a", "rb").read()
  st = time.time()
  interviewer = Interviewer()
  # interviewer.run()
  interviewer.speech_prosody_emotion_analysis(audio, "result_test")
  et = time.time()