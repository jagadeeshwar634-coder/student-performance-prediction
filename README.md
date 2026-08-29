# 🎓 Student Performance Prediction

An End-to-End Machine Learning Web Application that predicts a student's final academic score using five important factors.

---

## 📸 Project Preview

![Dashboard](docs/images/dashboard.png)

---

## 🚀 Live Demo

[🌐 Open Student Performance Prediction](YOUR_RENDER_LINK)

---

## 📊 Project Presentation

[📥 Download Project Presentation](./Student-Performance-Prediction.pdf)

---

## 🎯 Problem Statement

Students and educators often lack early, data-driven insight into academic performance.

This project predicts a student's final score using:

- 📚 Study Hours
- 📅 Attendance
- 📊 Previous Score
- 📝 Assignment Score
- 😴 Sleep Hours

---

## ✨ Features
[📥 Download Project Presentation](docs/features.png)

- 🔐 User Registration & Login
- 🔒 Secure Password Hashing
- 👤 User Profile
- 🎯 AI Performance Prediction
- 📈 Performance Analysis
- 💡 Personalized Suggestions
- 🕘 Prediction History
- 📊 Performance Trend Graph
- 🗑️ Selective History Deletion
- 📱 Responsive Design
- 🌌 Animated Earth/Space UI
- 🚀 Render Deployment

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Model Storage | Joblib |
| Authentication | Password Hashing + Sessions |
| Deployment | Render |
| Version Control | Git & GitHub |

---

## 🧠 Machine Learning

### Dataset

 - 300 records
- 6 columns
- 5 input features
- 1 target feature
- Zero duplicate records

### Input Features

| Feature | Description |
|---|---|
| Study Hours | Daily study time |
| Attendance | Attendance percentage |
| Previous Score | Previous academic score |
| Assignment Score | Assignment performance |
| Sleep Hours | Daily sleep duration |

### Models Tested

1) Linear Regression
2) Decision Tree
3) Random Forest

### Selected Model

**Linear Regression**

### Model Performance

| Metric | Result |
|---|---:|
| R² Score | 0.799 |
| MAE | 3.92 |
| MSE | 24.99 |

---

## 📊 Feature Influence

| Feature | Coefficient |
|---|---:|
| Study Hours | 10.04 |
| Previous Score | 3.87 |
| Attendance | 3.83 |
| Assignment Score | 2.95 |
| Sleep Hours | 0.75 |

---

## 🏗️ System Architecture

![Architecture](docs/images/architecture.png)

```text
👤 User
   │
   ▼
┌──────────────────────┐
│ HTML / CSS / JavaScript │
│      Frontend        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       FastAPI        │
│       Backend        │
└──────────┬───────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌──────────┐  ┌────────────┐
│ ML Model │  │ PostgreSQL │
│ Joblib   │  │  Database  │
│ Linear   │  │            │
│Regression│ │            │
└─────┬────┘  └─────┬──────┘
      │              │
      └──────┬───────┘
             ▼
    📊 Prediction & Analytics          
          ▼                ▼
       



