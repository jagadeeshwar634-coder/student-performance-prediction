from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

import pandas as pd
import joblib


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

# Templates
templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)

# Static
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)


# Login
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html"
    )


# Register
@app.get("/register")
def register(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html"
    )


# Dashboard
@app.get("/dashboard")
def dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ML Model
model = joblib.load(
    BASE_DIR / "student_performance_model.pkl"
)

scaler = joblib.load(
    BASE_DIR / "student_performance_scaler.pkl"
)


class StudentData(BaseModel):
    study_hours: float
    attendance: float
    previous_score: float
    assignment_score: float
    sleep_hours: float


@app.post("/predict")
def predict(data: StudentData):

    student = pd.DataFrame({
        "study_hours": [data.study_hours],
        "attendance": [data.attendance],
        "previous_score": [data.previous_score],
        "assignment_score": [data.assignment_score],
        "sleep_hours": [data.sleep_hours]
    })

    student_scaled = scaler.transform(student)

    prediction = model.predict(student_scaled)

    score = float(prediction[0])

    score = max(0, min(score, 100))

    return {
        "predicted_score": round(score, 2)
    }