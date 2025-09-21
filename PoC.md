<img width="257" height="68" alt="voyagr_logo_ws" src="https://github.com/user-attachments/assets/177f7fea-702c-40b4-83ac-9c6804ca1570" />


# VOYAGR – Proof of Concept (PoC)

## Objective
The PoC demonstrates the feasibility of our AI-driven travel itinerary generation using user prompts.  
It validates the core flow of VOYAGR: from user input → AI processing → structured day-wise itinerary → UI rendering.

---

## Scope of PoC

### 1. Authentication & Profiles
- Users can sign up with username, email, and password.  
- Users can log in using email and password.  
- Database connected via SQLite with persistence.  
- Password security handled using hashing (bcrypt via Passlib).  
- Core identity management is functional.

### 2. Trip Intake (Prompt-based)
- PoC uses a free-text prompt box instead of a structured form currently, to be upgraded in further sprints.  
- Example input: "plan a 3-day trip to Ahmedabad focusing on food and art."  
- User input is forwarded to the backend, which processes it into a structured query.  
- Validates that natural language input can seed itinerary generation.

### 3. Prompt Builder (Groq LLM, in current sprint)
- Groq API integrated with FastAPI.  
- Each response is unique and dynamically generated.  
- Backend requests structured JSON itineraries, not plain text.  
- Validates that AI logic works for different user inputs.

### 4. Itinerary Page (v1)
- Frontend renders results as trip heading plus day cards.  
- Each card contains:
  - Day number
  - Title
  - Activities
- UI supports edit and regenerate options.  
- Demonstrates that structured AI output can be presented cleanly.

### 5. Data Model (Prototype)
Implemented using SQLAlchemy ORM with SQLite.  

- User: stores profile credentials.  
- Trip: linked to a user, contains trip metadata.  
- ItineraryDay: linked to a trip, stores daily details.  
- Activity: optional, stores detailed tasks per day.      

Ensures itineraries can be saved, retrieved, and extended in later sprints.

### 6. UI Skeleton
- Tech stack: React + TypeScript + Vite + Tailwind CSS.  
- Components built: landing page, login/signup, planner input page, itinerary viewer (day cards).  
- Responsive design validated.  
- Establishes base templates for scaling.

---

## POC Workflow

1. User enters trip details in natural language.  
2. Frontend sends request to FastAPI endpoint.  
3. Backend processes request and queries Groq LLM.  
4. Groq returns structured itinerary JSON.  
5. Backend saves itinerary via SQLAlchemy.  
6. Frontend renders trip heading and day-wise cards.

---

## Key POC Validations
- End-to-end flow works: input → AI → database → UI.  
- AI output is unique (not static or hardcoded).  
- Day-wise itinerary structure is established.  
- UI and database skeleton ready for expansion in later sprints.

---

## Expected Outcome
A new user can complete the journey:  
- Register and log in.  
- Enter trip details in the form.  
- Receive a first-pass itinerary (stubbed with sample activities).  
- Edit notes or regenerate a day.  
- Save the itinerary.  

---

## Success Criteria
- End-to-end user flow is functional in staging.  
- Itinerary generation time < 8 seconds (using stubbed responses).  
- ≥90% successful form submissions leading to an itinerary.  

---

## Limitations
- No live place data yet (stubbed only).  
- No maps, budget validation, or external API integration.  
- Export and sharing features not included.

---

## Next Steps
- Replace SQLite with scalable database (Postgres).  
- Implement full trip intake form with structured fields.  
- Add support for multiple saved itineraries per user.  
- Enhance itinerary details (location tags, categories, timings).  
- Integrate external APIs (flights, hotels, maps).
