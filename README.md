# 📅 Workbetter-Duhs Calendar (Google Calendar Meeting Analyzer)

## 🧭 Overview
A full-stack application that integrates with Google Calendar to provide actionable insights into meeting patterns and improve weekly planning.The platform combines analytics, visualization, and scheduling tools to help users better understand and optimize how they spend their time in meetings.

A video demo is available on [Dropbox](https://www.dropbox.com/s/lgn6ey8zx63g8gq/Vue-Calendar.mov?dl=0).

---

## 🚀 Core Features

### 🔗 1. Calendar Integration & Data Processing
- Seamless integration with Google Calendar API to import user meeting data.
- Continuous synchronization to ensure up-to-date insights and scheduling accuracy.
- Secure handling of calendar events, attendees, and metadata.

---

### 📊 2. Weekly Analyzer (Insights Dashboard)

#### 📈 Meeting Statistics
- Total and average number of meetings attended and organized.
- Breakdown of time spent in meetings across the week.

#### 🗂️ Meeting Classification
- Categorization of meetings into recurring and one-time events.
- Insights into frequency and distribution of each type.

#### 📉 Meeting Trends
- Visual representation of meeting hours over time:
  - Past 4 weeks (short-term trends)
  - Past 4 months (long-term patterns)
- Helps identify productivity patterns and scheduling inefficiencies.

#### 🤝 Meeting Network
- Displays key individuals and organizations the user interacted with during the week.
- Highlights collaboration patterns and communication frequency.

---

### 🗓️ 3. Weekly Planner (Execution Layer)

#### 📆 Meeting Time Calendar
- Interactive weekly calendar view of all scheduled meetings.
- Detailed meeting information including:
  - Organizer
  - Attendees
  - Recurring vs one-time classification
- Ability to assign custom tags (e.g., `critical`, `personal`, `sync`) to meetings.

#### 🌐 Meeting Network
- Visualization of people and organizations the user is scheduled to meet.
- Enables proactive planning and prioritization.

---

### 🏷️ 4. Meeting Tagging & Categorization
- Users can label meetings with custom tags such as `critical`, `personal`, or `sync`.
- Tags are synchronized with Google Calendar for consistency across platforms.
- Enables filtered views and more personalized analytics.

---

### 📬 5. Notifications & Reporting
- Automated weekly email summaries including:
  - Key meeting statistics
  - Trends and insights
  - Upcoming meeting plans
- Designed to help users reflect on past activity and prepare for the week ahead.

---

## ⚙️ Technical Highlights
- Built using a modern full-stack architecture (Vue.js + Node.js).
- RESTful API integration with Google Calendar.
- Data visualization for trends and analytics.
- Scalable design for handling large volumes of calendar data.
- Focus on performance, usability, and clean UI/UX.

---

## 🛠️ Getting Started

### 📦 Prerequisites
- Node.js (v16+ recommended)
- Google Cloud Project with Calendar API enabled

### 📥 Installation
``` bash
# clone the repo 👯
git clone https://github.com/fullsnackops/Workbetter-Duhs-FE.git
cd Workbetter-Duhs-FE

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

