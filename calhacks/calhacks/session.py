
from calhacks.db import DatabaseConnector
from dataclasses import dataclass, asdict

@dataclass
class Session:
    id: str
    company: str
    job_description: str
    type: str
    num_q: int
    resume: str
    text_history: list
    emotion_history: list

# returns session id
def create_session(company: str, job_description: str, type: str, num_q: int, resume: str) -> str:
    session = Session(
        id = "",
        company=company,
        job_description=job_description,
        type=type,
        num_q=num_q,
        resume=resume,
        text_history=[]
    )
    
    # add session to db
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    result = database_connector.db["session"].insert_one(asdict(session))
    session.id = result.inserted_id
    return session.id

def get_session(session_id: str) -> Session:
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    session = database_connector.db["session"].find_one({"id": session_id})
    del session["_id"]
    session = Session(**session)
    return session

def add_user_input(session: Session, user_input: str) -> None:
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    session.text_history.append({"role": "user", "content": user_input})
    database_connector.db["session"].update_one({"id": session.id}, {"$set": asdict(session)})

def add_assistant_response(session: Session, assistant_response: str) -> None:
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    session.text_history.append({"role": "assistant", "content": assistant_response})
    database_connector.db["session"].update_one({"id": session.id}, {"$set": asdict(session)})

def add_emotion_entry(session: Session, emotion_entry: dict) -> None:
    database_connector = DatabaseConnector()
    database_connector.connect_to_db()
    session.emotion_history.append(emotion_entry)
    database_connector.db["session"].update_one({"id": session.id}, {"$set": asdict(session)})