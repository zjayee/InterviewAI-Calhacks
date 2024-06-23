
from django.shortcuts import render
import json
import base64
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import HttpResponse

from calhacks.session import create_session, get_session, add_user_input, add_assistant_response
from calhacks.prompt import generate_start_message, generate_message_history, generate_summary_prompt
from calhacks.db import DatabaseConnector
from ai.interviewer import Interviewer

def hello_world(request):
    return HttpResponse("Hello, World!")

@csrf_exempt
def test_db(request):
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    result = database_connector.db["convo"].insert_one({"hello": "world"})
    return HttpResponse(str(result.inserted_id))

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

    return HttpResponse(audio)

@csrf_exempt
def interview_loop(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    user_audio = base64.b64decode(json_data["user_audio"])
    interviewer = Interviewer()

    text = interviewer.get_text_from_audio(user_audio)
    add_user_input(session, text)

    prompt = generate_message_history(session, text)
    response = interviewer.get_response_from_gpt(prompt)
    add_assistant_response(session, response)

    audio = interviewer.get_audio_from_response(response)

    return HttpResponse(audio)

@csrf_exempt
def get_summary(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    interviewer = Interviewer()
    summary_prompt = generate_summary_prompt(session)
    response = interviewer.get_response_from_gpt(summary_prompt)
    
    return HttpResponse(response)

@csrf_exempt
def get_transcript(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    session = get_session(session_id)

    return HttpResponse(json.dumps(session.text_history))