# NileGroup-Attendance
# 🏢 Nile Group Attendance System

A modern, cross-platform employee attendance tracking system. This project allows employees to mark their attendance using their phones or computers, strictly enforced by a 50-meter GPS geofence around the office. Admins can monitor attendance in real-time via a secure web dashboard.

## ✨ Features
* **Multi-Platform:** Native clients for Web, Android (Kotlin), and iOS (SwiftUI).
* **GPS Geofencing:** Employs the Haversine formula to ensure employees can only clock in within 50 meters of the office coordinates.
* **Role-Based Access Control (RBAC):** Secure Firebase rules separate standard employees from administrators.
* **Admin Dashboard:** Real-time data visualization, search filtering, and one-click CSV Excel exports.
* **Sleek UI:** Glassmorphism design with a 3D animated Vanta.js background (Web).

## 🛠️ Technology Stack
* **Frontend (Web):** HTML5, CSS3, Vanilla JavaScript, Vanta.js
* **Mobile:** Android (Kotlin) & iOS (SwiftUI)
* **Backend / Database:** Firebase Authentication & Cloud Firestore (v10 Modular SDK)

## 🚀 Setup Instructions

### 1. Firebase Backend
1. Create a Firebase Project.
2. Enable **Email/Password Authentication**.
3. Create a **Cloud Firestore** database.
4. Apply the security rules found in the project documentation to restrict access.
5. Create a `users` collection. To make someone an admin, add a document where the ID is their Auth UID and set a field `role: "admin"`.

### 2. Web Client
1. Open `firebase.js`.
2. Replace the `firebaseConfig` object with your project's Web API keys.
3. Serve locally using Live Server or deploy via Firebase Hosting.

### 3. Android Client
1. Download your `google-services.json` from the Firebase Console.
2. Place it inside the `app/` directory of the Android project.
3. Sync Gradle and run on an emulator or physical device.

### 4. iOS Client
1. Download your `GoogleService-Info.plist` from the Firebase Console.
2. Drag and drop it into your Xcode project root.
3. Install the Firebase iOS SDK via Swift Package Manager.
4. Build and run the simulator.
