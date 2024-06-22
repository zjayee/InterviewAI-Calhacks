import os
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from pymongo.database import Database
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


# Create your views here.
from django.http import HttpResponse

class DatabaseConnector:
    client: MongoClient
    metadata_db: Database
    uri = os.getenv("dbURL")

    def __init__(self):
        pass

    def connect_to_db(self) -> None:
        """Connects to Mongodb database"""
        # Create a new client and connect to the server
        self.client = MongoClient(self.uri, server_api=ServerApi('1'))
        self.metadata_db = self.client["metadata"]

    def get_metadata_db(self) -> Database:
        """Returns Mongodb database"""
        return self.metadata_db

def hello_world(request):
    return HttpResponse("Hello, World!")

@csrf_exempt 
def my_view(request):
    if request.method == 'POST':
        try:
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