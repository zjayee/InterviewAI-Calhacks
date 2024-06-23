import os
import time
from groq import Groq
from openai import OpenAI


class Interviewer:
  def __init__(self):
    # Initialize any necessary variables or resources here
    self.open_ai_client = OpenAI()
    self.gorq_client = Groq()
  
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
    print(response.iter_bytes())
    return response.iter_bytes()
  
  # def run(self):
  #   input_text = self.get_text_from_audio()
  #   response = self.get_response_from_gpt(input_text)
  #   audio = self.get_audio_from_response(response)
  #   return audio

if __name__ == "__main__":
  start_time = time.time()
  audio = open("sample_audio.m4a", "rb").read()
  st = time.time()
  interviewer = Interviewer(context=[], audio=audio)
  interviewer.run()
  et = time.time()