# AI Study Portal (Alvi Project)

## Project Overview

AI Study Portal is a web-based AI-powered learning platform that uses **Large Language Models (LLMs)**—specifically **Transformer-Based Models**—along with the **Google Gemini AI API** to intelligently generate and distribute educational content.

The main objective of this portal is to provide students with a single, structured, and interactive platform for studying AI-assisted learning material.

**Live Website:** [https://aistudy-henna.vercel.app/](https://aistudy-henna.vercel.app/)

---

## Technologies Used

* **Frontend:** Next.js
* **Backend:** Next.js (API Routes)
* **Database:** Supabase
* **Authentication:** Supabase Auth (User Login / Signup)
* **AI Model:** Transformer-Based Large Language Model (LLM)
* **AI API:** Google Gemini AI

---

## Key Features

### 1. AI-Based Content Distribution

The system uses an LLM to automatically analyze and distribute input text into the following categories:

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

* The AI **does not scan document images**
* It analyzes **uploaded images only**
* Relevant educational content is generated based on the image

### 3. Authentication-Based Access Control

* When a user is **logged in**:

  * The document save button is enabled
  * Export options (content/images) are available
* When a user is **not logged in**:

  * Only view access is allowed
  * Save and export features are disabled

### 4. Data Storage

* User-generated and saved documents are securely stored in the **Supabase database**

---

## System Architecture

1. User uploads text or an image
2. A request is sent to the Google Gemini AI API
3. The Transformer-Based LLM processes the input
4. Content is generated and distributed into educational categories
5. Logged-in users can save or export the generated content

---

## Node Modules Folder Issue

If the **node_modules** folder is missing after cloning the project, follow these steps:

### Installation

```bash
npm install
```

Or if using Yarn:

```bash
yarn install
```

To run the project:

```bash
npm run dev
```

---

## Important Notes

* Any automatically generated **date and time should be removed** before final submission
* Demo **screenshots should be added** for better explanation
* The project is optimized for **academic submission**

---

## Demo Screenshots

> (Add demo screenshots here)

* Home Page
* AI Content Generation Page
* Login Page
* Saved Documents Page

---

## Conclusion

AI Study Portal is a modern AI-driven educational system that demonstrates the effective use of Transformer-Based LLMs and Google Gemini AI for intelligent content generation and automation. The project provides a structured, secure, and user-friendly learning experience.

---

## Developed By

Ahmed Ali Mughal

---

*This README.md file is intended for project documentation and academic portal submission.*
