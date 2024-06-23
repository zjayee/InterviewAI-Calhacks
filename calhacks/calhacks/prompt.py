from calhacks.session import get_session, Session

def get_interview_context(session: Session) -> str:
    interview_context = f"""
        You are Andrew an interviewer for {session.company}, conducting a {session.type} interview with a candidate.
        Your goal is to evaluate the candidate’s fit for the role based on their resume and responses to your questions.
        Job Description: {session.job_description}\n
        Candidate Resume: {session.resume}\n"""
    return interview_context

def get_summary_context(session: Session) -> str:
    summary_context = f"""
        This is a {session.type} interview for {session.company} with a candidate.
        Evaluate the candidate’s fit for the role their responses.
        Job Description: {session.job_description}\n

        Please provide feedback on the candidate's performance in the interview. Use the interview history and the following emotional analysis to guide your feedback. Provide analysis in bullet point form, do not ask additional questions." 
        {get_emotion_analysis(session)}
        """
    return summary_context

def get_emotion_analysis(session: Session) -> str:
    return str(session.emotion_history)

def generate_start_message(session: Session) -> list:
    start_interview_prompt = get_interview_context(session) + "Please start the interview by introducing yourself and ask the candidate to introduce themselves."

    messages=[
        {"role": "system", "content": start_interview_prompt},
    ]
    return messages

def generate_message_history(session: Session, user_input: str) -> list:
    continue_interview_prompt = get_interview_context(session) + "Please continue the interview by responding to the candidate's response and asking the candidate a question."
    messages = [{"role": "system", "content": continue_interview_prompt}]
    messages += session.text_history
    messages.append({"role": "user", "content": user_input})
    return messages

def generate_summary_prompt(session: Session) -> str:
    interview_feedback_prompt = get_summary_context(session)
    print(interview_feedback_prompt)
    messages = [{"role": "system", "content": interview_feedback_prompt}]
    messages += session.text_history
    return messages