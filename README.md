# Gen-AI Flashcard

## Description

Gen-AI Flashcard is a project designed to help users create and manage flashcards using generative AI technologies.
It leverage RAG to process the uploaded PDF and generates different kind of questions like: SCQ, MCQ and simple flash card with question answer using Few Shot Prompting.

## Installation

1. Clone the repository:

    ```sh
    git clone git@github.com:skjo0c/gen-ai-flashcard-.git
    ```

2. Navigate to the project directory:

    ```sh
    cd gen-ai-flashcard
    ```

3. Add `.env` file for server inside `gen-ai-flashcard/server`. See `.env.example`.
4. Set up the virtual environment:

    ```sh
    python3 -m venv genai-project
    source genai-project/bin/activate
    ```

5. Install the required dependencies:

    ```sh
    pip install -r requirements.txt
    ```

6. Navigate to the webapp directory:

    ```sh
    cd webapp
    ```

7. Install the web application dependencies:

    ```sh
    yarn
    ```

### Usage

1. Activate the virtual environment:

    ```sh
    source genai-project/bin/activate
    ```

2. Run server application:

    ```sh
    uvicorn main:app --reload --port 6969
    ```

3. Start the web application:

    ```sh
    yarn dev
    ```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
