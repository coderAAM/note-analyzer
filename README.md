# AI Study Portal (Alvi Project)

## Project Overview

AI Study Portal ek web-based AI learning platform hai jo **Large Language Models (LLMs)**—specifically **Transformer-Based Models**—aur **Google Gemini AI API** ka use karke study content ko intelligently distribute karta hai.

Portal ka purpose students ko ek single platform par structured, categorized aur interactive learning material provide karna hai.

**Live URL:** [https://aistudy-henna.vercel.app/](https://aistudy-henna.vercel.app/)

---

## Key Technologies Used

* **Frontend:** Next.js
* **Backend:** Next.js (API Routes)
* **Database:** Supabase
* **Authentication:** Supabase Auth (User Login / Signup)
* **AI Model:** Transformer-Based LLM
* **AI API:** Google Gemini AI

---

## Core Features

### 1. AI-Based Content Distribution

LLM ka use karke input text ko following categories mein automatically distribute kiya jata hai:

* Key Points
* Summary
* Detailed Explanation
* Charts
* Diagrams
* MCQs
* Short Questions
* Long Questions
* Viva Questions
* Self Test

### 2. Image Understanding

* AI **document images ko scan nahi karta**
* Sirf **uploaded images** ko analyze karta hai
* Image se relevant learning content generate karta hai

### 3. Authentication-Based Access Control

* User **login hoga tabhi**:

  * Document save karne ka button visible hoga
  * Export (images / content) ka option milega
* Without login:

  * Sirf view access
  * Save / export features disabled rahenge

### 4. Data Storage

* User ke saved documents aur generated content **Supabase database** mein store hote hain

---

## System Architecture

1. User text ya image upload karta hai
2. Google Gemini AI API ko request jati hai
3. Transformer-Based LLM content analyze karta hai
4. Output multiple educational categories mein divide hota hai
5. Logged-in users data save/export kar sakte hain

---

## Node Modules Folder Issue

Agar project clone karne ke baad **node_modules folder missing** ho:

### Installation Steps

```bash
npm install
```

Ya agar yarn use ho:

```bash
yarn install
```

Iske baad project run karein:

```bash
npm run dev
```

---

## Important Notes

* Time aur date jo automatically generate ho rahi ho, **final submission se pehle remove kar di jaye**
* Demo ke liye **screenshots** attach karna recommended hai
* Project academic purpose ke liye optimized hai

---

## Screenshots (Demo)

> (Yahan demo screenshots add kiye jayenge)

* Home Page
* AI Content Generation
* Login Page
* Saved Documents View

---

## Conclusion

AI Study Portal ek modern AI-powered educational system hai jo Transformer-Based LLMs aur Google Gemini AI ka effective use karta hai. Ye project students ke liye structured learning, automation aur intelligent content generation ka complete solution provide karta hai.

---

## Developed By

Ahmed Ali Mughal

---

*Note: Ye README.md file portal submission aur project documentation ke liye use ki ja sakti hai.*
