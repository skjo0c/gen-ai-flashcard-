from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import io
import json
from dotenv import dotenv_values
from PyPDF2 import PdfReader
from openai import OpenAI

config = dotenv_values(".env")

client = OpenAI(
    api_key=config.get("OPENAI_API_KEY")
)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PdfUpload(BaseModel):
    filename: Optional[str] = None

def extract_text_from_pdf(pdf_content: bytes) -> str:
    pdf_file = io.BytesIO(pdf_content)
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def generate_qa_from_text(text: str) -> dict:
    # prompt = f"Generate questions and answers from the following text:\n\n{text}\n\nQuestions and Answers:"
    
    prompt = f"""
    Generate questions and answers from the following text in the specified format:
    
    Text:
    {text}
    
    Format:
    [
      {{
        id: '1',
        type: 'SCQ',
        question: 'What is the capital of France?',
        options: [
          {{ id: 'a', text: 'London' }},
          {{ id: 'b', text: 'Berlin' }},
          {{ id: 'c', text: 'Paris' }},
          {{ id: 'd', text: 'Madrid' }}
        ],
        answer: 'c',
        explanation: 'Paris is the capital and largest city of France.'
      }},
      {{
        id: '2',
        type: 'MCQ',
        question: 'Which of these are primary colors?',
        options: [
          {{ id: 'a', text: 'Red' }},
          {{ id: 'b', text: 'Green' }},
          {{ id: 'c', text: 'Blue' }},
          {{ id: 'd', text: 'Yellow' }}
        ],
        answer: ['a', 'c', 'd'],
        explanation: 'The primary colors are Red, Blue, and Yellow.'
      }},
      {{
        id: '3',
        type: 'QA',
        question: 'What is photosynthesis?',
        answer: 'Photosynthesis is the process by which plants convert light energy into chemical energy to produce glucose from carbon dioxide and water.'
      }}
    ]
    
    Provide the data as a raw JSON array without enclosing it in triple backticks or adding any formatting.
    """

    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt}
                ],
            }
        ],
        model="gpt-4o-mini",
    )
    
    print(response.choices[0].message.content)

    # Parse JSON content into a Python list
    qa_list = response.choices[0].message.content
    
    return json.loads(qa_list)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload-pdf")
async def read_pdf(pdf: UploadFile = File(...)):
    print('-----------Reading pdf---------------')
    try:
        pdf_bytes = await pdf.read()  # Read the file as binary
        pdf_stream = io.BytesIO(pdf_bytes)  # Convert to a stream
        
        reader = PdfReader(pdf_stream)
        number_of_pages = len(reader.pages)
        
        # Extract text from the PDF
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Generate questions and answers
        return generate_qa_from_text(text)
    except UnicodeDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Error decoding PDF file: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
