# 📑 Non-Functional Requirements (NFRs)

## 1. Usability

**Description:**  
From user feedback, it is clear that users want a clean and easy-to-navigate UI.
The system shall provide a clean, intuitive, and user-friendly interface that is easy to navigate.  
Users should be able to complete tasks with minimal learning effort and without unnecessary complexity.  

**Acceptance Criteria:**  
- The UI should follow industry-standard design guidelines (Material Design, Human Interface Guidelines, etc.).  
- Average user task completion time should not exceed **X seconds** (to be determined).  
- At least **90% of new users** should be able to navigate the core features without training.  

---

## 2. Performance

**Description:**  
From user responses, the top pain points when planning a trip are research, reviews of the place, hidden costs and real - time updates.  
 
**Acceptance Criteria:**  
- System response time shall not exceed **2 seconds** for 95% of transactions.   
- Data updates (e.g., availability, reviews, costs) shall reflect in real-time or near real-time (< 5 seconds).  
- The system shall implement mechanisms to detect and flag false or misleading content.  

---

## 3. System Availability

**Description:**  
The system shall provide continuous and reliable access to users with minimal downtime.  

**Acceptance Criteria:**  
- System uptime shall be at least **99.9%** per month.  
- In case of failure, recovery shall occur within **< 5 minutes**.  

---

## 4. Data Security

**Description:**  
The system shall ensure that user data is protected against unauthorized access, misuse, and breaches.  

**Acceptance Criteria:**  
- Data shall be encrypted both in transit.  
- Role-based access control (RBAC) shall be enforced.  
- System shall comply with GDPR and other relevant data protection standards.

---

 ## 5. Scalability

**Description:**  
The system shall be able to handle increasing numbers of users, data, and transactions without performance degradation.  

**Acceptance Criteria:**  
- The system shall support at least *X concurrent users* (to be determined) without noticeable slowdown.  
- The system shall allow both horizontal (adding servers) and vertical (upgrading hardware) scaling.  
- Database queries shall remain efficient (≤ 2 seconds) even with **10× expected data growth**.  

---

## 6. Maintainability

**Description:**  
The system shall be designed for easy maintenance, updates, and extensions, minimizing the risk of introducing defects.  

**Acceptance Criteria:**  
- Code shall follow standard coding conventions and be well-documented.  
- At least **80% unit test coverage** shall be maintained for core modules.  
- New developers shall be able to onboard and contribute within **2 weeks**.  
- The system shall include automated monitoring and logging for quick issue detection.

---

# 7. Reliability

**Description:**  
The system shall perform its required functions consistently and correctly under stated conditions for a specified period of time. It must be resilient to errors and ensure data integrity. 

**Acceptance Criteria:**  
- The system shall have a measured Mean Time Between Failures (MTBF) of at least [X] hours.  
- Critical user transactions (e.g., booking confirmations, payment processing, itinerary generation) shall have a 99.9% success rate.  
- Data corruption or loss due to system error shall not exceed 0.001% of all transactions.  
- The system shall implement robust error handling and automatic retry mechanisms for dependent service failures (e.g., payment gateway, hotel API).

---

# 8. Interoperability & Compatibility

**Description:**  
The system shall operate effectively across a variety of devices, operating systems, and browsers, and shall integrate seamlessly with third-party services.

**Acceptance Criteria:**  
- The web application shall be fully functional on the latest versions of Chrome, Safari, Firefox, and Edge.  
- The mobile application shall support the current and previous major versions of iOS and Android.  
- API integrations with third-party services (hotels, transport) shall successfully complete data exchange per their specifications 99.5% of the time.  
- Exported documents (PDF, Calendar – FR7) shall be readable and correctly formatted in standard corresponding applications (e.g., Adobe Acrobat, Google Calendar, Outlook).

---

# 9. Accessibility

**Description:**  
The system shall be designed to be usable by people with a wide range of abilities and disabilities, ensuring equitable access to all features.

**Acceptance Criteria:**  
- The application shall meet WCAG (Web Content Accessibility Guidelines) 2.1 Level AA standards.  
- All functionality shall be operable through a keyboard interface (without requiring specific timings for individual keystrokes).  
- All non-text content (e.g., icons, images, maps) shall have text alternatives (alt text) and captions.  
- UI components shall have sufficient color contrast (minimum 4.5:1) and shall not rely solely on color to convey information.  
- The system shall be compatible with common screen readers (e.g., JAWS, NVDA, VoiceOver).

---

  
