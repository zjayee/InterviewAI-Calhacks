import os
import time
import json
from groq import Groq
from openai import OpenAI
from hume import HumeBatchClient
from hume.models.config import FaceConfig, ProsodyConfig, LanguageConfig
from dotenv import load_dotenv, dotenv_values 
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fabric import Connection
from dotenv import dotenv_values
from pydantic import BaseModel
from io import BytesIO

HOST_IP = "100.82.142.94"
GATEWAY_IP = "146.152.232.8"
SSH_KEY = "ssh.pub"

class Interviewer:
  def __init__(self):
    # Initialize any necessary variables or resources here
    load_dotenv()
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
  
  def speech_prosody_emotion_analysis(self, filebytes) -> dict: 
    """Perform Speech prosody emotion measurement with Hume client. Save the result as .json in the specifed position
       
      args:
        filebytes: the filebytes of the audio file to be analyzed
        result_path: the path and file name to store the emotion analysis result as .json
      return:
        anaylsis result in a dictionary
    """
    # Prosody_config = ProsodyConfig()
    language_config = LanguageConfig(granularity="conversational_turn")
    job = self.hume_client.submit_job([], [language_config], filebytes=("", filebytes)) # need further change "tuple" to "list(tuples)"" when running batch analysis
    # print(job)
    # print("Running...")
    details = job.await_complete()
    # print(job.get_predictions()[1]["results"]["predictions"][0]["models"])
    # job.download_predictions(result_path + ".json")
    # print("emotion_analysis done")
    return job.get_predictions()[1]["results"]["predictions"][0]["models"]

  def combine_audio_response_analysis(self, question:str, response_text:str, analysis_result:str) -> tuple:
    """Combine the question, user's response, and emotion analysis in this QA session and generate two prompt for GPT

      args:
        question(str): the question posted by GPT in this loop
        response_text(str): the user's response to the posted question
        analysis_path(str): the path to the analysis to the response, stored in a .json
      return:
        content_prompt, sentiment_prompt(tuple)
    """
    content_prompt = [{"role":"system", "content": "Give feedback on the interviewee's response content. Keep your response under 10 words."},
              {"role":"assistant", "content": f"Interview question: {question}"},
              {"role":"user", "content": f"Interviewee's answer: '{response_text}'"},]
    
    sentiment_prompt = [{"role":"system", "content": "Give feedback on the interviewee's response sentiment, give feedback on the dominant emotion. Keep your response under 10 words."},
              {"role":"assistant", "content": f"Interview question: {question}"},
              {"role":"user", "content": f"Emotional Analysis Result of the interviewee's response: {json.dumps(analysis_result)}",
              }]

    return content_prompt, sentiment_prompt
  
  def generate_video(self, i):
    playground = Connection(host=HOST_IP,
                        gateway=Connection('guest@146.152.232.8'),
                        connect_kwargs={
                          "key_filename": [SSH_KEY]
                        })
    #playground.run("python3 inference_2.py --checkpoint_path \"checkpoints/wav2lip_gan.pth\" --face \"intel_ceo.mp4\" --audio {audio}")
    video_name = f"results/result_voice{i}.mp4"
    io_obj = BytesIO()
    playground.get(video_name, io_obj)
    print(io_obj.getvalue())
    playground.close()
    return io_obj.getvalue()


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
  analysis_result = interviewer.speech_prosody_emotion_analysis(audio)
  question = "What's your favorite project?"
  response = interviewer.get_text_from_audio(audio)
  combined_prompt = interviewer.combine_audio_response_analysis(question, response, analysis_result)
  # print(combined_prompt)
  content_feedback = interviewer.get_response_from_gpt(combined_prompt[0])
  print("\n\n\n")
  emotion_feedback = interviewer.get_response_from_gpt(combined_prompt[1])
  
  
  et = time.time()