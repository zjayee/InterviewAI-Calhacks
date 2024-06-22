"""
Mongodb connection
"""
import os
from pymongo.database import Database
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


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


if __name__ == '__main__':
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    user_test = {
        "name": "name",
    }
    x = database_connector.metadata_db["user"].insert_one(user_test)
    print(x.inserted_id)