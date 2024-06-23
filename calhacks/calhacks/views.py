
from django.shortcuts import render
import json
import base64
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import HttpResponse

from calhacks.session import create_session, get_session, add_user_input, add_assistant_response, add_emotion_entry
from calhacks.prompt import generate_start_message, generate_message_history, generate_summary_prompt, generate_end_prompt
from calhacks.db import DatabaseConnector
from ai.interviewer import Interviewer

def hello_world(request):
    return HttpResponse("Hello, World!")

@csrf_exempt
def start_session(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = create_session(json_data["company"], json_data["job_description"], json_data["type"], int(json_data["num_q"]), json_data["resume"])
    return HttpResponse(session_id)

@csrf_exempt
def start_interview(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)
    
    interviewer = Interviewer()

    prompt = generate_start_message(session)
    response = interviewer.get_response_from_gpt(prompt)
    add_assistant_response(session, response)

    audio = interviewer.get_audio_from_response(response)
    # Convert iterator of bytes to a single bytes object
    audio_bytes = b''.join(audio)
    # Encode the bytes object into a base64 string
    audio64 = base64.b64encode(audio_bytes).decode('utf-8')
    output = {"audio_output": audio64, "text_output": response}

    return HttpResponse(json.dumps(output))

@csrf_exempt
def interview_loop(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    user_audio = base64.b64decode(json_data["user_audio"])
    interviewer = Interviewer()

    text = interviewer.get_text_from_audio(user_audio)
    emotional_analysis = interviewer.speech_prosody_emotion_analysis(user_audio)

    add_emotion_entry(session, emotional_analysis)
    add_user_input(session, text)
    prompt = generate_message_history(session, text)
    response = interviewer.get_response_from_gpt(prompt)
    add_assistant_response(session, response)

    audio = interviewer.get_audio_from_response(response)
    # Convert iterator of bytes to a single bytes object
    audio_bytes = b''.join(audio)

    # Encode the bytes object into a base64 string
    audio64 = base64.b64encode(audio_bytes).decode('utf-8')
    output = {"audio_output": audio64, "text_output": response}

    return HttpResponse(json.dumps(output))

@csrf_exempt
def end_interview(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)
    interviewer = Interviewer()
    user_audio = base64.b64decode(json_data["user_audio"])
    text = interviewer.get_text_from_audio(user_audio)

    emotional_analysis = interviewer.speech_prosody_emotion_analysis(user_audio)
    add_user_input(session, text)
    add_emotion_entry(session, emotional_analysis)

    prompt = generate_end_prompt(session)
    response = interviewer.get_response_from_gpt(prompt)
    add_assistant_response(session, response)
    output = {"text_output": response}

    return HttpResponse(json.dumps(output))

@csrf_exempt
def get_summary(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    interviewer = Interviewer()
    summary_prompt = generate_summary_prompt(session)
    response = interviewer.get_response_from_gpt(summary_prompt)

    output = {"summary_analysis": response}
    
    return HttpResponse(json.dumps(output))

@csrf_exempt
def get_question_summary(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    interviewer = Interviewer()
    question = session.text_history[-3]["content"]
    response = session.text_history[-2]["content"]
    analysis_result = session.emotion_history[-1]
    content_prompt, emotion_prompt = interviewer.combine_audio_response_analysis(question, response, analysis_result)

    content_feedback = interviewer.get_response_from_gpt(content_prompt)
    emotion_feedback = interviewer.get_response_from_gpt(emotion_prompt)

    output = {"content_feedback": content_feedback, "emotion_feedback": emotion_feedback}
    
    return HttpResponse(json.dumps(output))

@csrf_exempt
def get_transcript(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    return HttpResponse(json.dumps(session.text_history))