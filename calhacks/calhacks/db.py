from pymongo import MongoClient
from pymongo.database import Database
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv, dotenv_values 
import os

class DatabaseConnector:
    client: MongoClient
    db: Database
    uri: str

    def __init__(self):
        # loading variables from .env file
        load_dotenv() 
        self.uri = os.getenv("dbURL")

    def connect_to_db(self) -> None:
        """Connects to Mongodb database"""
        print(self.uri)
        # Create a new client and connect to the server
        self.client = MongoClient(self.uri, server_api=ServerApi('1'))
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        self.db = self.client["db"]

    def get_db(self) -> Database:
        """Returns Mongodb database"""
        return self.db