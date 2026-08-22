from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Float,ForeignKey,Date

from database import Base


# =========================
# USER MODEL
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )
    
    profile_image = Column(
        String(500),
        nullable=True
    )
    
    date_of_birth = Column(
        Date,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


# =========================
# PREDICTION HISTORY MODEL
# =========================

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=False,
    index=True
)

    study_hours = Column(
        Float,
        nullable=False
    )

    attendance = Column(
        Float,
        nullable=False
    )

    previous_score = Column(
        Float,
        nullable=False
    )

    assignment_score = Column(
        Float,
        nullable=False
    )

    sleep_hours = Column(
        Float,
        nullable=False
    )

    predicted_score = Column(
        Float,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )