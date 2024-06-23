from calhacks.session import get_session, Session

def get_interview_context(session: Session) -> str:
    interview_context = f"""
        You are Andrew an interviewer for {session.company}, conducting a {session.type} interview with a candidate.
        Your goal is to evaluate the candidate’s fit for the role based on their resume and responses to your questions.
        Job Description: {session.job_description}\n
        Candidate Resume: {session.resume}\n"""

def generate_start_message(session_id: str) -> list:
    session = get_session(session_id)
    start_interview_prompt = get_interview_context(session) + "Please start the interview by introducing yourself and ask the candidate to introduce themselves."

    messages=[
        {"role": "system", "content": start_interview_prompt},
    ]
    return messages

def generate_message_history(session_id:str, user_input: str) -> list:
    session = get_session(session_id)
    continue_interview_prompt = get_interview_context(session) + "Please continue the interview by responding to the candidate's response and asking the candidate a question."
    messages = [{"role": "system", "content": continue_interview_prompt}]
    messages += session.text_history
    messages.append({"role": "user", "content": user_input})
    return messages