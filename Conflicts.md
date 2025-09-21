# Conflicts Between Epics and Their Resolutions

A key part of successful project management is identifying and resolving potential conflicts or dependencies between different development streams (Epics). Below are the primary conflicts identified for the VOYAGR project and our planned resolutions.

## 1. Epic 1 (Authentication) vs. Epic 2 (Itinerary Generation)

**Conflict:** The AI-powered itinerary generation in Epic 2 relies on user-specific data, such as a user's budget and preferences, which are managed within the user profile features of Epic 1. Without a functional user profile, Epic 2 cannot provide personalized itineraries.  

**Resolution:** We will prioritize and complete Epic 1 in the very early stages of Sprint 1. This establishes the foundational user data model and authentication endpoints, ensuring that Epic 2 has the necessary data to begin its core functionality.  

---

## 2. Epic 2 (Itinerary Generation) vs. Epic 3 (Core Architecture)

**Conflict:** The core workflow of itinerary generation and display (Epic 2) is dependent on the database schemas and foundational architecture defined in Epic 3. Incorrect or incomplete schemas would prevent the system from properly saving and retrieving trip data.  

**Resolution:** The data model design in Epic 3 will be finalized and implemented in the first half of Sprint 1. This will provide the necessary database structure for the backend team to begin building the core logic for itinerary generation and persistence as planned in Epic 2.  

---

## 3. Epic 4 (Enrichment) vs. Epic 5 (Export & Sharing)

**Conflict:** The features in Epic 5, such as exporting a PDF of an itinerary, are significantly more valuable when the itineraries are rich with data like photos, ratings, and maps from Epic 4. Attempting to export a "bare-bones" itinerary would provide a poor user experience.  

**Resolution:** We will schedule the tasks in Epic 5 to begin only after the core data enrichment tasks in Epic 4 are completed. This ensures that the export and sharing features will provide users with a complete and visually appealing document, maximizing their value.  

---

## 4. Epic 6 (Quality & Performance) vs. All Other Epics

**Conflict:** Tasks related to system optimization, caching, and end-to-end testing (Epic 6) are dependent on other features being stable and functional. It's inefficient to optimize a system that is still undergoing major feature changes.  

**Resolution:** We will integrate tasks from Epic 6 into the final part of each sprint. For example, performance improvements and accessibility fixes will be addressed in Sprint 2, while final end-to-end testing and polish will be the primary focus of Sprint 3. This iterative approach ensures that quality is built in, rather than being a last-minute effort.  

---

## 5. Sprint-Level Resource Conflict (Sprint 1)

**Conflict:** Sprint 1 includes a heavy workload for the backend team, with the simultaneous development of Epic 1 (Authentication), Epic 3 (Data Models), and a significant portion of Epic 2 (Itinerary Logic). This could lead to bottlenecks and a delay in delivering a working prototype.  

**Resolution:** We will distribute the workload by having the backend team focus on Epics 1 and 3 first to establish the foundational architecture. Simultaneously, the frontend team can begin work on the UI/UX components for Epic 2, such as the trip intake form and the itinerary display, using mock data. This parallel development allows us to make progress without being blocked and ensures the core prototype is ready on schedule.  
