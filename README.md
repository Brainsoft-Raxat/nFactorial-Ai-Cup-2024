# nFactorial-Ai-Cup-2024

## Rakhat Khamitov

## 🎓 GradRizz ⚡
AI assistant for graduate program guidance.
Link to the demo on **Vercel**: [GradRizz Demo](https://n-factorial-ai-cup-2024-9cgq.vercel.app/)

## Description
GradRizz is an AI-powered assistant designed to help users navigate and choose graduate programs. The application leverages Firebase for backend storage and FastAPI for real-time chat functionality. Users can interact with the AI to get personalized recommendations and information on various graduate programs.

## Features
- Search for various graduate programs and scholarships
- Details about admission requirements, deadlines, and more
- Real-time chat with AI assistant

## How to Run
1. **Clone the repository**
    ```sh
    git clone https://github.com/Brainsoft-Raxat/nFactorial-Ai-Cup-2024
    cd nFactorial-Ai-Cup-2024
    ```

2. **Set up Firebase**
   - Create a Firebase project and add your web app.
   - Install Firebase CLI:
     ```sh
     npm install -g firebase-tools
     ```
   - Initialize Firebase in your project:
     ```sh
     cd firebase
     firebase login
     firebase init
     firebase deploy --only functions
     ```

3. **Run the backend server**
    ```sh
    cd gradrizz-api-py
    uvicorn app.server:app --port 8000 --reload
    ```

4. **Run the frontend client**
    ```sh
    cd gradrizz-app
    ```
    - Rename ***.env.local.example*** (inside ***gradrizz-app*** directory) to ***.env.local*** and enter your Firebase project configurations.
    - Run:
    ```sh
    yarn install
    yarn dev
    ```

## Typeform to submit:
[Submit your feedback here](https://docs.google.com/forms/d/e/1FAIpQLSfjnACTWf5xYKInMllmhy5Bchc-DnOXw6vEXsHmXI4XFPwZXw/viewform?usp=sf_link)

## DEADLINE: 26/05/2024 10:00
