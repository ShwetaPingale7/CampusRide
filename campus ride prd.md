# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Product Name:** Campus Ride (Working Title)
**Version:** 1.0
**Last Updated:** [Insert Date]
**Status:** Draft

---

## 1. Document History

| Version | Date          | Author        | Changes       |
| ------- | ------------- | ------------- | ------------- |
| 1.0     | [Insert Date] | [Insert Name] | Initial Draft |

---

## 2. Executive Summary

Campus Ride is a mobile application designed exclusively for college students to share two-wheeler rides within their city. It combines the convenience of on-demand bike taxis with the community-driven model of carpooling, enabling students without vehicles to find affordable, reliable rides from fellow students commuting on similar routes.

The application emphasizes **trust, safety, and affordability** through:

* College email-based verification
* Manual ID verification
* Vehicle and license validation
* In-ride SOS emergency features
* Rating and reporting system

Campus Ride aims to reduce commuting costs, enhance student networking, and create a safer campus mobility ecosystem.

---

## 3. Background & Problem Statement

### 3.1 Current Situation

* Many students rely on crowded public transport.
* Ride-hailing services are expensive for daily use.
* Students with two-wheelers bear full fuel and maintenance costs.
* Safety concerns, especially for female students, remain high.

### 3.2 Opportunity

A closed, verified, student-only ride-sharing platform can provide:

* Lower commuting costs
* Higher trust and safety
* A stronger student community

---

## 4. Goals & Success Metrics

### 4.1 Product Goals

1. Achieve 30% student adoption within the first semester.
2. Facilitate 500+ completed rides per week within 3 months.
3. Maintain zero major safety incidents.
4. Achieve 40% weekly retention.
5. Reduce commute cost by 40% compared to alternatives.

### 4.2 Key Performance Indicators (KPIs)

| Metric               | Target            |
| -------------------- | ----------------- |
| Verified Users       | ≥ 30% of students |
| Rides Offered/Week   | ≥ 200             |
| Rides Completed/Week | ≥ 150             |
| Ride Acceptance Rate | ≥ 80%             |
| Average Rating       | ≥ 4.5             |
| Weekly Retention     | ≥ 40%             |

---

## 5. User Personas

### 5.1 Anjali – Daily Commuter

* Needs affordable and reliable rides.
* Wants safe and punctual transport.
* Struggles with crowded buses.

### 5.2 Rahul – Bike Owner

* Wants to reduce fuel costs.
* Prefers not riding alone daily.
* Interested in meeting new people.

### 5.3 Vikram – Late Night Student

* Needs safe late-night transport.
* Concerned about safety.
* Values SOS and tracking features.

---

## 6. User Stories

### 6.1 Onboarding & Verification

* User signs up using college email.
* Uploads college ID for verification.
* Rider uploads driving license and vehicle details.
* Admin verifies documents.

### 6.2 Offering a Ride

* Rider enters start, destination, time, seats.
* Option to set gender preference.
* Estimated fare displayed.
* Ride published to platform.

### 6.3 Finding a Ride

* Passenger searches by pickup and drop.
* Views rider details, rating, vehicle info.
* Sends ride request.
* Receives acceptance notification.

### 6.4 During Ride

* SOS button visible at all times.
* Live location sharing available.
* Rider marks ride as started and completed.

### 6.5 Post Ride

* Passenger pays via UPI or marks as paid.
* Both users rate each other.
* Report inappropriate behavior option available.

### 6.6 Admin Panel

* View pending verifications.
* Block/unblock users.
* View complaints and resolve disputes.

---

## 7. Functional Requirements

### 7.1 User Authentication & Profile

* College email sign-up with OTP verification.
* Profile completion required.
* Mandatory ID upload.
* Rider must upload license and RC.
* Admin approval required before full access.

### 7.2 Ride Offering

* Create ride with location, date, time.
* Seat selection (1–2).
* Optional gender preference.
* Fare estimation based on distance.
* Ride visible in search feed.

### 7.3 Ride Searching

* Search by location.
* Ride card displays rider info, rating, vehicle.
* Gender preference validation.
* Ride request option.

### 7.4 Matching System

* Push notification for request.
* Rider accepts/declines.
* Ride status changes to confirmed.
* Masked contact details shared.

### 7.5 Safety Features

* SOS button sends live location via SMS.
* Optional live location sharing.
* Auto-cancel if not started within grace period.

### 7.6 Payment & Ratings

* UPI payment integration.
* Manual cash settlement option.
* Mutual rating system.
* Admin review if rating < 3.5.

### 7.7 Admin Dashboard

* User management.
* Verification approval.
* Complaint handling.
* Analytics overview.

---

## 8. Non-Functional Requirements

| Category      | Requirement                                |
| ------------- | ------------------------------------------ |
| Security      | Encrypted data, TLS 1.2+, hashed passwords |
| Scalability   | Support 10,000 concurrent users            |
| Performance   | Search results under 2 seconds             |
| Availability  | 99.5% uptime                               |
| Compatibility | Android 8+, iOS 13+                        |
| Offline Mode  | Limited cached access                      |

---

## 9. Analytics & Tracking

Track:

* Sign-up and verification rates
* Ride creation and completion
* Acceptance rates
* Rating distribution
* SOS usage
* Retention metrics (Day 1, Week 1, Month 1)

---

## 10. Out of Scope (Version 1)

* In-app chat
* Full live ride tracking
* Four-wheeler rides
* Recurring scheduled rides
* Automated OCR ID verification
* Multi-college support

---

## 11. Assumptions & Dependencies

### Assumptions

* Students have smartphones with internet.
* College does not restrict the platform.
* Sufficient two-wheeler owners exist.
* Rating system deters misuse.

### Dependencies

* Google Maps APIs
* Firebase Authentication
* UPI Payment Gateway
* Cloud Hosting (AWS/GCP/Azure)
* Push Notifications (FCM/APNS)

---

## 12. Technical Stack (High-Level)

| Layer          | Technology          |
| -------------- | ------------------- |
| Mobile App     | React Native (Expo) |
| Backend        | Node.js + Express   |
| Database       | PostgreSQL + Prisma |
| Real-Time      | Socket.io           |
| Authentication | Firebase Auth       |
| Payments       | Razorpay            |
| Maps           | Google Maps SDK     |
| Storage        | AWS S3 / Cloudinary |
| Hosting        | AWS / Google Cloud  |

---

## 13. Risks & Open Questions

### Risks

* Low adoption → Mitigation: Incentives and campus marketing.
* Safety incidents → Mitigation: Strict verification + SOS.

### Open Questions

* Should college security be integrated?
* Should cancellation penalties be added in v2?

---

## 14. Glossary

**Rider:** Student offering a ride.
**Passenger:** Student requesting a ride.
**SOS:** Emergency alert feature.
**Verification Badge:** ID verified indicator.

---


---
// # 15. System Architecture

```
                ┌──────────────────────────┐
                │      Mobile App          │
                │  (React Native - iOS/Android) │
                └──────────────┬───────────┘
                               │ HTTPS (TLS)
                               ▼
                ┌──────────────────────────┐
                │        Backend API       │
                │    Node.js + Express     │
                ├──────────────────────────┤
                │ - Authentication Module  │
                │ - Ride Management Module │
                │ - Matching Engine        │
                │ - Payment Handler        │
                │ - Notification Service   │
                │ - Admin Module           │
                └──────────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌──────────────┐      ┌────────────────┐     ┌────────────────┐
│ PostgreSQL   │      │ Firebase Auth  │     │ Payment Gateway │
│ Database     │      │ (OTP/Auth)     │     │ (Razorpay UPI)  │
└──────────────┘      └────────────────┘     └────────────────┘
        │
        ▼
┌──────────────────┐
│ Cloud Storage     │
│ (AWS S3 / CDN)    │
└──────────────────┘

External Integrations:
- Google Maps APIs
- Push Notifications (FCM/APNS)
- SMS Gateway (SOS)
```

---

## 15.3 Component Breakdown

### 15.3.1 Mobile Application Layer

**Technology:** React Native (Expo)

Responsibilities:

* User authentication interface
* Ride creation & search UI
* Real-time ride status updates
* Payment initiation
* SOS functionality
* Ratings & feedback
* Push notification handling

Security:

* All API communication via HTTPS (TLS 1.2+)
* Token-based authentication (JWT)

---

### 15.3.2 Backend Application Layer

**Technology:** Node.js + Express

Modules:

1. **Authentication Module**

   * Email verification via OTP
   * Token generation and validation
   * Role-based access (User/Admin)

2. **User Management Module**

   * Profile storage
   * Document upload handling
   * Verification status management

3. **Ride Management Module**

   * Ride creation
   * Ride search
   * Ride request handling
   * Status updates

4. **Matching Engine**

   * Filters by:

     * Location proximity
     * Time window
     * Gender preference
   * Sorts by departure time & distance

5. **Payment Module**

   * Integrates UPI gateway
   * Records payment status
   * Handles transaction logging

6. **Notification Service**

   * Push notifications via FCM/APNS
   * SMS alerts for SOS

7. **Admin Module**

   * Document verification
   * User blocking
   * Complaint resolution
   * Analytics dashboard

---

### 15.3.3 Data Layer

**Database:** PostgreSQL

Core Tables:

* Users
* Documents
* Vehicles
* Rides
* RideRequests
* Ratings
* Payments
* Reports

Data Security:

* Encrypted at rest
* Role-based database access
* Audit logs for admin actions

---

## 15.4 Deployment Architecture

Hosting:

* Backend hosted on AWS EC2 or Google Cloud Run
* Database hosted on managed PostgreSQL (RDS / Cloud SQL)
* Static assets served via CDN
* File storage on AWS S3

Scalability:

* Horizontal scaling using load balancers
* Auto-scaling groups for peak hours
* Database read replicas (future)

---

## 15.5 Security Architecture

* JWT-based session management
* Input validation & sanitization
* Rate limiting to prevent abuse
* Role-based access control
* Encrypted file storage
* Secure payment tokenization

---

# 16. User Workflow

## 16.1 End-to-End User Journey

### 1. Registration & Verification Flow

```
Open App
   ↓
Enter College Email
   ↓
Receive OTP
   ↓
Verify OTP
   ↓
Complete Profile
   ↓
Upload College ID
   ↓
(If Rider → Upload License & RC)
   ↓
Admin Verification
   ↓
Access Granted
```

---

## 16.2 Ride Offering Workflow (Rider)

```
Home Screen
   ↓
Tap "Offer Ride"
   ↓
Enter Start & Destination
   ↓
Select Date & Time
   ↓
Choose Seats
   ↓
Set Gender Preference (Optional)
   ↓
System Calculates Fare
   ↓
Publish Ride
   ↓
Receive Ride Requests
   ↓
Accept / Decline
   ↓
Ride Confirmed
   ↓
Start Ride
   ↓
Complete Ride
   ↓
Receive Payment
   ↓
Rate Passenger
```

---

## 16.3 Ride Booking Workflow (Passenger)

```
Home Screen
   ↓
Tap "Find Ride"
   ↓
Enter Pickup & Destination
   ↓
View Ride List
   ↓
Check Rider Profile & Rating
   ↓
Send Ride Request
   ↓
Wait for Acceptance
   ↓
Ride Confirmed
   ↓
Meet Rider
   ↓
Ride Starts
   ↓
Complete Ride
   ↓
Make Payment
   ↓
Rate Rider
```

---

## 16.4 SOS Emergency Workflow

```
Active Ride Screen
   ↓
Tap SOS Button
   ↓
Confirm Emergency Alert
   ↓
System Sends:
   - Live Location via SMS
   - Alert to Emergency Contact
   - Optional Alert to College Security
```

---

## 16.5 Admin Workflow

```
Admin Login
   ↓
Dashboard View
   ↓
Review Pending Verifications
   ↓
Approve / Reject
   ↓
Monitor Rides & Reports
   ↓
Block / Suspend Users (If Required)
```

---

# 17. Future Architecture Enhancements (Post v1)

* Real-time GPS tracking dashboard
* Microservices architecture split (Auth, Ride, Payment)
* AI-based ride matching optimization
* Automated document verification using OCR
* Multi-college multi-tenant architecture

---

