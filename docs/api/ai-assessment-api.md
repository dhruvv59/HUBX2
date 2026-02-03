# AI Assessment API Integration Documentation

## Overview
This document outlines the API integration requirements for the AI Assessment creation feature, specifically for manual question creation with support for Text, MCQ, and Fill in the Blanks question types.

## Question Types

The system supports three question types:

### 1. Text Question
Basic text-based questions requiring written answers.

### 2. Multiple Choice Question (MCQ)
Questions with multiple options where one is correct.

### 3. Fill in the Blanks
Questions with one or more blanks that students must fill in.

---

## Data Types

### QuestionType
```typescript
type QuestionType = "Text" | "MCQ" | "Fill in the Blanks";
```

### Difficulty
```typescript
type Difficulty = "Easy" | "Intermediate" | "Advanced";
```

### MCQOption
```typescript
interface MCQOption {
    id: string;
    text: string;
    isCorrect: boolean;
}
```

### FillInTheBlank
```typescript
interface FillInTheBlank {
    id: string;
    position: number; // Position in the question text where blank appears
    correctAnswer: string;
    placeholder?: string; // Optional placeholder text for the blank
}
```

### Question
```typescript
interface Question {
    id: string;
    type: QuestionType;
    difficulty: Difficulty;
    content: string;
    solution: string;
    marks?: number;
    // MCQ specific fields
    options?: MCQOption[]; // Required only for MCQ type
    // Fill in the Blanks specific fields
    blanks?: FillInTheBlank[]; // Required only for Fill in the Blanks type
}
```

---

## API Endpoints

### 1. Create Assessment Draft
**Endpoint:** `POST /api/teacher/assessments/drafts`

**Purpose:** Create a new assessment draft with basic configuration

**Request Body:**
```json
{
    "title": "Science Intermediate Paper 2025",
    "standard": "10",
    "subject": "Science",
    "difficulty": "Intermediate",
    "chapters": [
        {
            "id": "ch1",
            "name": "Thermodynamics",
            "selected": true
        }
    ],
    "isTimeBound": true,
    "isPublic": false,
    "schoolOnly": true,
    "duration": 60,
    "price": 0
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "draftId": "draft_abc123xyz",
        "createdAt": "2026-02-04T01:19:12Z"
    }
}
```

---

### 2. Add Question to Draft
**Endpoint:** `POST /api/teacher/assessments/drafts/{draftId}/questions`

**Purpose:** Add a question to an existing draft

**Request Body Examples:**

#### Text Question
```json
{
    "type": "Text",
    "difficulty": "Intermediate",
    "content": "Distinguish between boiling and evaporation.",
    "solution": "Boiling occurs throughout the liquid at a specific temperature. Evaporation occurs only at the surface at any temperature.",
    "marks": 5
}
```

#### MCQ Question
```json
{
    "type": "MCQ",
    "difficulty": "Easy",
    "content": "What is the capital of France?",
    "solution": "Paris is the capital and largest city of France, known for its art, culture, and history.",
    "marks": 2,
    "options": [
        {
            "id": "opt-1",
            "text": "London",
            "isCorrect": false
        },
        {
            "id": "opt-2",
            "text": "Paris",
            "isCorrect": true
        },
        {
            "id": "opt-3",
            "text": "Berlin",
            "isCorrect": false
        },
        {
            "id": "opt-4",
            "text": "Madrid",
            "isCorrect": false
        }
    ]
}
```

#### Fill in the Blanks Question
```json
{
    "type": "Fill in the Blanks",
    "difficulty": "Intermediate",
    "content": "The capital of France is _____ and it is located on the _____ river.",
    "solution": "Paris is the capital of France, situated on the Seine river, which flows through the city.",
    "marks": 3,
    "blanks": [
        {
            "id": "blank-1",
            "position": 0,
            "correctAnswer": "Paris",
            "placeholder": "Answer 1"
        },
        {
            "id": "blank-2",
            "position": 1,
            "correctAnswer": "Seine",
            "placeholder": "Answer 2"
        }
    ]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "questionId": "q_xyz789abc",
        "addedAt": "2026-02-04T01:25:30Z"
    }
}
```

---

### 3. Get Draft Details
**Endpoint:** `GET /api/teacher/assessments/drafts/{draftId}`

**Purpose:** Retrieve complete draft including all questions

**Response:**
```json
{
    "success": true,
    "data": {
        "draftId": "draft_abc123xyz",
        "title": "Science Intermediate Paper 2025",
        "standard": "10",
        "subject": "Science",
        "difficulty": "Intermediate",
        "chapters": [...],
        "isTimeBound": true,
        "isPublic": false,
        "schoolOnly": true,
        "duration": 60,
        "price": 0,
        "questions": [
            {
                "id": "q_xyz789abc",
                "type": "Text",
                "difficulty": "Intermediate",
                "content": "Distinguish between boiling and evaporation.",
                "solution": "...",
                "marks": 5
            },
            {
                "id": "q_def456ghi",
                "type": "MCQ",
                "difficulty": "Easy",
                "content": "What is the capital of France?",
                "solution": "...",
                "marks": 2,
                "options": [...]
            }
        ],
        "createdAt": "2026-02-04T01:19:12Z",
        "updatedAt": "2026-02-04T01:25:30Z"
    }
}
```

---

### 4. Remove Question from Draft
**Endpoint:** `DELETE /api/teacher/assessments/drafts/{draftId}/questions/{questionId}`

**Purpose:** Remove a specific question from the draft

**Response:**
```json
{
    "success": true,
    "message": "Question removed successfully"
}
```

---

### 5. Publish Assessment
**Endpoint:** `POST /api/teacher/assessments/publish`

**Purpose:** Publish the draft as a live assessment

**Request Body:**
```json
{
    "draftId": "draft_abc123xyz"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "assessmentId": "assessment_live_123",
        "publishedAt": "2026-02-04T01:30:00Z",
        "status": "published",
        "accessUrl": "/assessments/assessment_live_123"
    }
}
```

---

## Validation Rules

### Text Questions
- `content` must not be empty
- `solution` must not be empty
- `marks` should be a positive number

### MCQ Questions
- `content` must not be empty
- Must have at least 2 `options`
- Exactly one option must have `isCorrect: true`
- All options must have non-empty `text`
- `solution` is optional but recommended

### Fill in the Blanks Questions
- `content` must not be empty
- Must have at least 1 blank in `blanks` array
- All blanks must have non-empty `correctAnswer`
- The number of blanks should match the number of blank indicators (_____ or [blank]) in the content
- `solution` is optional but recommended

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid question data",
        "details": [
            {
                "field": "options",
                "message": "MCQ must have at least one correct option"
            }
        ]
    }
}
```

### 404 Not Found
```json
{
    "success": false,
    "error": {
        "code": "DRAFT_NOT_FOUND",
        "message": "Draft with ID draft_abc123xyz not found"
    }
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred while processing your request"
    }
}
```

---

## Authentication

All API endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Rate Limiting

- Maximum 100 requests per minute per teacher
- Bulk operations (adding multiple questions) should use batch endpoints if available

---

## Notes for Backend Implementation

1. **Type Validation**: Ensure that when `type: "MCQ"`, the `options` field is present and valid. Similarly, validate `blanks` for "Fill in the Blanks".

2. **Auto-save**: Consider implementing auto-save functionality to prevent data loss.

3. **Versioning**: Maintain version history of drafts for audit purposes.

4. **Image Upload**: The UI has "Attach Image" buttons - implement image upload endpoints for questions and solutions.

5. **Question Bank Integration**: The UI supports adding questions from a question bank - ensure this functionality is available.

6. **Permissions**: Verify that only the teacher who created the draft can modify it.

7. **Sanitization**: Sanitize all text inputs to prevent XSS attacks.

8. **Database Schema**: Ensure your database schema supports polymorphic question types with conditional fields.
