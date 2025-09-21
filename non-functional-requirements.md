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
