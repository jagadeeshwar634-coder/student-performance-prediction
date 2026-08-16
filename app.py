import streamlit as st
import pandas as pd
import joblib


model = joblib.load("student_performance_model.pkl")
scaler = joblib.load("student_performance_scaler.pkl")


st.title("🎓 Student Performance Prediction")

st.write("Enter student details to predict the final score.")


study_hours = st.number_input(
    "Study Hours",
    min_value=0.0,
    max_value=24.0,
    value=6.0
)

attendance = st.number_input(
    "Attendance (%)",
    min_value=0.0,
    max_value=100.0,
    value=85.0
)

previous_score = st.number_input(
    "Previous Score",
    min_value=0.0,
    max_value=100.0,
    value=70.0
)

assignment_score = st.number_input(
    "Assignment Score",
    min_value=0.0,
    max_value=100.0,
    value=75.0
)

sleep_hours = st.number_input(
    "Sleep Hours",
    min_value=0.0,
    max_value=24.0,
    value=7.0
)


if st.button("Predict Performance"):

    new_student = pd.DataFrame({
        "study_hours": [study_hours],
        "attendance": [attendance],
        "previous_score": [previous_score],
        "assignment_score": [assignment_score],
        "sleep_hours": [sleep_hours]
    })

    new_student_scaled = scaler.transform(new_student)

    
    prediction = model.predict(new_student_scaled)

    st.success(f"🎯 Predicted Final Score: {prediction[0]:.2f}")