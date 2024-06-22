
from calhacks.db import DatabaseConnector
from dataclasses import dataclass, asdict
import uuid

@dataclass
class Session:
    id: str
    company: str
    job_description: str
    type: str
    num_q: int
    resume: str
    text_history: list[str]


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
    print(result.inserted_id)
    session.id = result.inserted_id
    return session.id