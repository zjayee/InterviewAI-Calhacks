
from django.shortcuts import render
import json
import base64
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import HttpResponse

from calhacks.session import create_session, get_session
from calhacks.prompt import generate_start_message, generate_message_history
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
def interview_loop(request):
    json_data = json.loads(request.body.decode('utf-8'))
    session_id = json_data["session_id"]
    print("sessionid: " +session_id)
    session = get_session(session_id)
    print(session)
    user_audio = base64.b64decode(json_data["user_audio"])
    interviewer = Interviewer()
    text = interviewer.get_text_from_audio(user_audio)
    prompt = generate_message_history(session, text)
    response = interviewer.get_response_from_gpt(prompt)
    audio = interviewer.get_audio_from_response(response)
    return HttpResponse(audio)

@csrf_exempt 
def my_view(request):
    if request.method == 'POST':
        try:
            print(request.body.decode('utf-8'))
            json_data = json.loads(request.body.decode('utf-8'))
            print(json_data)
            print(json_data["hello"])
            return HttpResponse(json_data["hello"])
            # Do something with the JSON data
        except json.JSONDecodeError as e:
            # Handle invalid JSON data
            return HttpResponse("Sad")

# sample endpoint
# @csrf_exempt 
# def create_user(request):
#     try:
#         database_connector = DatabaseConnector()
#         database_connector.connect_to_db()
#         user_test = {
#             "name": "name",
#         }
#         x = database_connector.metadata_db["user"].insert_one(user_test)
#         # print(x.inserted_id)
#         return HttpResponse(x.inserted_id)
#     except Exception as e:
#         # Handle invalid JSON data
#         return HttpResponse("Sad")