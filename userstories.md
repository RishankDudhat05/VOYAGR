# VOYAGR User Stories

## Functional Requirement User Stories

---

### US-01: AI-Powered Itinerary Generation

#### User Story
> *As a* traveler,
> *I want to* input my trip details,
> *So that* the app automatically generates a personalized itinerary, saving me from manual planning.

#### Acceptance Criteria
- *And I know I am done when:* I can provide my trip details, click a "Generate" button, and a full day-by-day plan is displayed.

#### Source Justification
This story implements FR1 – AI-Powered Itinerary Generation. It was validated by the survey, where 75.6% of users wanted this feature.

---

### US-02: Real-Time Trip Alerts

#### User Story
> *As a* traveler on my trip,
> *I want to* receive live updates on weather or closures,
> *So that* I can adjust my plans and avoid disruptions.

#### Acceptance Criteria
- *And I know I am done when:* I receive an in-app notification for a major weather event or an unexpected closure affecting an activity in my plan.

#### Source Justification
This story implements FR2 – Real-Time Updates. It was identified as the most requested feature in the survey, with 77.8% of users finding it highly useful.

---

### US-03: Pre-Trip Budget Estimation

#### User Story
> *As a* budget-conscious traveler,
> *I want to* see an estimated cost breakdown before my trip,
> *So that* I can understand the financial requirements in advance.

#### Acceptance Criteria
- *And I know I am done when:* After generating an itinerary, the system provides an estimated cost breakdown for activities and other potential expenses.

#### Source Justification
This story implements FR3 – Budget Estimation & Tracking. The survey showed that 66.7% of users need this feature.

---

### US-04: In-Trip Expense Tracking

#### User Story
> *As a* traveler on my trip,
> *I want to* track my ongoing expenses against my budget,
> *So that* I can stay within my financial limits.

#### Acceptance Criteria
- *And I know I am done when:* I can add a new expense with a name and amount, and see my remaining budget update automatically.

#### Source Justification
This story implements FR3 – Budget Estimation & Tracking. The survey confirmed that 76.7% of users consider a budget a hard constraint.

---

### US-05: Itinerary Customization

#### User Story
> *As a* traveler who likes to be flexible,
> *I want to* modify my generated itinerary by reordering or removing activities,
> *So that* I can personalize the plan.

#### Acceptance Criteria
- *And I know I am done when:* I can drag-and-drop an activity to a new time or day, or delete an activity, and the changes are saved.

#### Source Justification
This story implements FR4 – Itinerary Customization. The survey confirmed that 57.8% of users requested this functionality.

---

### US-06: Group Cost Sharing

#### User Story
> *As a* person planning a trip with friends,
> *I want a* tool to split our shared expenses,
> *So that* we can manage our group budget fairly.

#### Acceptance Criteria
- *And I know I am done when:* I can add an expense, mark it as "shared," and see the cost divided among all group members.

#### Source Justification
This story implements FR5 – Group Planning Tools. The survey validated its high importance, showing that 80% of users want split budget tracking.

---

### US-07: Vote on Group Activities

#### User Story
> *As a* person planning a group trip,
> *I want* my friends to be able to vote on suggested activities,
> *So that* we can easily make decisions together.

#### Acceptance Criteria
- *And I know I am done when:* I can add a poll to a shared itinerary, group members can cast their votes, and I can see the final results.

#### Source Justification
This story implements FR5 – Group Planning Tools. The need for this was identified during team brainstorming as a solution for group coordination, which was identified as a pain point for 27.3% of users in the survey.

---

### US-08: Export Itinerary to PDF

#### User Story
> *As a* traveler,
> *I want to* export my final itinerary as a PDF,
> *So that* I can have a reliable offline copy on my phone.

#### Acceptance Criteria
- *And I know I am done when:* I can click an "Export" button, select the PDF option, and download a well-formatted file of my plan.

#### Source Justification
This story implements FR6 – Export & Share Itinerary. The survey showed that 53.3% of users requested this functionality.

---

### US-09: Book Hotels Within the App

#### User Story
> *As a* user finalizing my trip,
> *I want to* see hotel recommendations and book them directly within the platform,
> *So that* I don't have to switch to another app.

#### Acceptance Criteria
- *And I know I am done when:* I can view a list of recommended hotels, see their prices, and complete a booking without leaving the application.

#### Source Justification
This story implements FR7 – Key Integrations. This was identified as a high-demand feature from the survey, where over 80% of users wanted hotel and transport integrations.

---

## Non-Functional Requirement User Stories

---

### US-10: Intuitive First-Time Use

#### User Story
> *As a* new user,
> *I want* the app to be simple and easy to navigate,
> *So that* I can generate my first itinerary without needing a tutorial.

#### Acceptance Criteria
- *And I know I am done when:* Over 90% of new users can successfully complete the core workflow (generating an itinerary) without assistance.

#### Source Justification
This story addresses NFR 1 (Usability). This was based on survey feedback requesting a "clean and easy-to-navigate UI".

---

### US-11: Fast Application Performance

#### User Story
> *As* any user,
> *I want* the application to load quickly,
> *So that* I can plan my trip efficiently without frustration.

#### Acceptance Criteria
- *And I know I am done when:* 95% of screen transitions and data loads complete in under 2 seconds.

#### Source Justification
This story addresses NFR 2 (Performance). This was based on the survey, where users cited "Time-consuming research" as a major pain point.

---

### US-12: Continuous System Availability

#### User Story
> *As a* traveler in a different time zone,
> *I want* the app to be available at all hours,
> *So that* I can access my plans whenever I need them, day or night.

#### Acceptance Criteria
- *And I know I am done when:* System uptime is at least 99.9% per month, ensuring reliable access.

#### Source Justification
This story addresses NFR 3 (System Availability). The requirement for 24/7 access was defined during team brainstorming.

---

### US-13: Secure User Authentication

#### User Story
> *As a* user,
> *I want to* create a secure account and log in reliably,
> *So that* I know my personal information and trip plans are protected.

#### Acceptance Criteria
- *And I know I am done when:* All user passwords are encrypted using modern hashing algorithms and role-based access control is enforced.

#### Source Justification
This story addresses NFR 4 (Data Security). The need for secure authentication was established during team brainstorming.

---

### US-14: Data Privacy Confidence

#### User Story
> *As a* user,
> *I want to* be confident that my travel data is private and not shared without my consent,
> *So that* I can trust the application.

#### Acceptance Criteria
- *And I know I am done when:* All data is encrypted in transit (HTTPS) and the system complies with data protection standards like GDPR.

#### Source Justification
This story addresses NFR 4 (Data Security). This fundamental requirement for user trust was established during team brainstorming.
