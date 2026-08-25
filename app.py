from pathlib import Path
from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi import Depends, Form, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from database import Base, engine, get_db
from models import User, PredictionHistory
from datetime import datetime, timezone, date
from pwdlib import PasswordHash
from typing import List
import pandas as pd
import joblib


# Password hashing
password_hash = PasswordHash.recommended()


# Base directory
BASE_DIR = Path(__file__).resolve().parent
PROFILE_UPLOAD_DIR = BASE_DIR / "static" / "profile_images"
PROFILE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# FastAPI app
app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key="studentai-secret-key-change-this"
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Templates
templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


# Static files
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# PAGE ROUTES
# =========================

# Login page
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={"request": request}
    )


# Register page
@app.get("/register")
def register(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={"request": request}
    )


# Dashboard
@app.get("/dashboard")
def dashboard(request: Request):

    if not request.session.get("user"):
        return RedirectResponse(
            url="/",
            status_code=303
        )

    user = request.session["user"]

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "user": user
        }
    )


# =========================
# ML MODEL
# =========================

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


# =========================
# PREDICTION API
# =========================

@app.post("/predict")
def predict(
    data: StudentData,
    request: Request,
    db: Session = Depends(get_db)
):
    

    # Check login session
    user = request.session.get("user")

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    # Prepare student data
    student = pd.DataFrame({
        "study_hours": [data.study_hours],
        "attendance": [data.attendance],
        "previous_score": [data.previous_score],
        "assignment_score": [data.assignment_score],
        "sleep_hours": [data.sleep_hours]
    })

    # Scale input
    student_scaled = scaler.transform(student)

    # ML prediction
    prediction = model.predict(student_scaled)

    score = float(prediction[0])

    # Keep score between 0 and 100
    score = max(0, min(score, 100))

    score = round(score, 2)

    # =========================
    # SAVE PREDICTION HISTORY
    # =========================

    history = PredictionHistory(
        user_id=user["id"],
        study_hours=data.study_hours,
        attendance=data.attendance,
        previous_score=data.previous_score,
        assignment_score=data.assignment_score,
        sleep_hours=data.sleep_hours,
        predicted_score=score
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    # Return prediction
    return {
        "predicted_score": score,
        "message": "Prediction saved successfully",
        "prediction_id": history.id
    }


# =========================
# REGISTER API
# =========================

@app.post("/register")
def register_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    name = name.strip()
    email = email.strip().lower()

    # Check existing email
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = password_hash.hash(password)

    # Create user
    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration successful"
    }



# =========================
# LOGIN API
# =========================

@app.post("/login")
def login_user(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    print("🔥 LOGIN ROUTE HIT")
    email = email.strip().lower()

    print("LOGIN EMAIL:", email)
    print("PASSWORD LENGTH:", len(password))

    # Find user
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # User not found
    if not user:
        print("USER NOT FOUND")

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    print("USER FOUND:", user.email)

    # Verify password
    password_valid = password_hash.verify(
        password,
        user.password_hash
    )

    print("PASSWORD VALID:", password_valid)

    # Wrong password
    if not password_valid:
        print("PASSWORD DOES NOT MATCH")

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Login successful
    print("LOGIN SUCCESS")

    # Create session
    request.session["user"] = {
    "id": user.id,
    "name": user.name,
    "email": user.email
}

    return {
        "message": "Login successful",
        "name": user.name,
        "email": user.email
    }
# =========================
# PROFILE PAGE
# =========================

@app.get("/profile")
def profile(
    request: Request,
    db: Session = Depends(get_db)
):

    user_session = request.session.get("user")

    if not user_session:
        return RedirectResponse(
            url="/",
            status_code=303
        )

    # Get latest user data from PostgreSQL
    user = (
        db.query(User)
        .filter(User.id == user_session["id"])
        .first()
    )

    if not user:
        request.session.clear()
        return RedirectResponse(
            url="/",
            status_code=303
        )

    # Get current user's history
    history = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.user_id == user.id
        )
        .order_by(
            PredictionHistory.created_at.desc()
        )
        .all()
    )

    return templates.TemplateResponse(
        request=request,
        name="profile.html",
        context={
            "request": request,
            "user": user,
            "history": history
        }
    )
    
    # =========================
# UPDATE PROFILE
# =========================

@app.post("/profile/update")
async def update_profile(
    request: Request,
    name: str = Form(...),
    date_of_birth: str = Form(""),
    profile_image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):

    user_session = request.session.get("user")

    if not user_session:
        return RedirectResponse(
            url="/",
            status_code=303
        )

    # Get current user
    user = (
        db.query(User)
        .filter(User.id == user_session["id"])
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # =========================
    # UPDATE NAME
    # =========================

    name = name.strip()

    if name:
        user.name = name

    # =========================
    # UPDATE DATE OF BIRTH
    # =========================

    if date_of_birth:
        try:
            user.date_of_birth = datetime.strptime(
                date_of_birth,
                "%Y-%m-%d"
            ).date()

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date of birth"
            )

    # =========================
    # UPDATE PROFILE IMAGE
    # =========================

    if profile_image and profile_image.filename:

        allowed_types = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }

        if profile_image.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, PNG and WEBP images are allowed"
            )

        extension = allowed_types[
            profile_image.content_type
        ]

        filename = f"user_{user.id}{extension}"

        file_path = PROFILE_UPLOAD_DIR / filename

        # Remove old profile images
        for old_file in PROFILE_UPLOAD_DIR.glob(
            f"user_{user.id}.*"
        ):
            old_file.unlink(missing_ok=True)

        # Save new image
        contents = await profile_image.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        user.profile_image = (
            f"/static/profile_images/{filename}"
        )

    # =========================
    # SAVE CHANGES
    # =========================

    db.commit()
    db.refresh(user)

    # Update session
    request.session["user"] = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profile_image": user.profile_image
    }

    return RedirectResponse(
        url="/profile",
        status_code=303
    )
    
    
# =========================
# PREDICTION HISTORY API
# =========================

@app.get("/history")
def prediction_history(
    request: Request,
    db: Session = Depends(get_db)
):

    # Check login session
    user = request.session.get("user")

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    # Get current user's prediction history
    history = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.user_id == user["id"]
        )
        .order_by(
            PredictionHistory.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "study_hours": item.study_hours,
            "attendance": item.attendance,
            "previous_score": item.previous_score,
            "assignment_score": item.assignment_score,
            "sleep_hours": item.sleep_hours,
            "predicted_score": item.predicted_score,
            "created_at": item.created_at.isoformat()
        }
        for item in history
    ] 
# =========================
# DELETE SELECTED HISTORY
# =========================

@app.post("/history/delete")
def delete_prediction_history(
    request: Request,
    prediction_ids: List[int] = Form(...),
    db: Session = Depends(get_db)
):

    # Check login session
    user = request.session.get("user")

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    # Delete only predictions belonging to current user
    deleted_count = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.id.in_(prediction_ids),
            PredictionHistory.user_id == user["id"]
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return RedirectResponse(
        url="/profile",
        status_code=303
    ) 
    
    
      
# =========================
# LOGOUT
# =========================

@app.get("/logout")
def logout(request: Request):

    request.session.clear()

    return RedirectResponse(
        url="/",
        status_code=303
    )