# LearnLoop AI

**LearnLoop AI** is a full-stack, AI-powered personalized education platform built with React, TypeScript, Tailwind CSS, Express, and the `@google/genai` SDK (`gemini-4-hydrogen`).

It connects AI tutoring, structured curriculum generation, diagnostic quizzing, adaptive weak-topic detection, study planning, and progress analytics into a cohesive closed-loop learning workflow.

## Key Features

1. **Dashboard**: Overview of daily learning streak, weekly study volume, active courses, recent quiz scores, and adaptive recommended next lessons.
2. **AI Tutor (`/api/tutor/chat`)**: Server-side Gemini tutoring chat with subject/topic context and three pedagogical modes (*Intuitive*, *Step-by-Step*, *Exam Prep*).
3. **Learning Path Generator (`/api/learning-path/generate`)**: Generates structured Beginner, Intermediate, and Advanced lesson roadmaps for any subject and topic, with completion tracking and 1-click handoff to the AI Tutor or Quiz Generator.
4. **Quiz Generator (`/api/quiz/generate`)**: Creates difficulty-calibrated multiple-choice quizzes with instant scoring, concept tagging, and full answer explanations.
5. **Adaptive Learning (`/api/adaptive/analyze`)**: Evaluates quiz mistakes and course mastery to surface root causes and prioritize next study actions.
6. **Study Planner**: Interactive weekly study schedule and measurable study goals persisted locally in `localStorage`.
7. **Analytics**: 7-day study volume chart, quiz score trajectory chart, course progress breakdown, and strengths vs. improvement areas.

## Architecture & Security

- All Gemini API requests are executed exclusively on the Express backend (`server.ts`) using `process.env.GEMINI_API_KEY`.
- No API keys or `@google/genai` client calls exist in frontend browser code.
- Student progress, generated learning paths, quiz history, and study plans persist in browser `localStorage` with a built-in demo reset option.

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Set `GEMINI_API_KEY` in your `.env` file or environment secrets:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Run in development mode** (Express + Vite middleware on port 3000):
   ```bash
   npm run dev
   ```

4. **Type-check and build for production**:
   ```bash
   npm run lint
   npm run build
   ```
