# Lodgify Lite

Lodgify Lite is a comprehensive travel and accommodation booking platform built with modern web technologies. It offers a seamless experience for users to book hotels, flights, and buses, while providing robust tools for property owners and administrators to manage the platform.

## 🚀 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
*   **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **AI/Generative Features**: [Genkit](https://firebase.google.com/docs/genkit), [Google AI](https://ai.google.dev/)
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore)
*   **Authentication**: Custom role-based authentication using Firebase.

## ✨ Key Features

### 🏨 Hotel Booking
*   **Dynamic Discovery**: Browse and search for hotels with advanced filtering options.
*   **Detailed Listings**: View comprehensive hotel details, including amenities, room types, and reviews.
*   **Seamless Booking**: Easy-to-use booking flow for guests.

### ✈️ Flight Booking
*   **Search & Book**: Find domestic and international flights.
*   **Real-time Availability**: Check seat availability and pricing.

### 🚌 Bus Booking
*   **Route Search**: Search for bus routes between cities.
*   **Seat Selection**: Choose your preferred seats.

### 👥 User Roles
*   **Guest**: Search and book accommodations and travel.
*   **Hotel Owner**: Submit and manage hotel properties, view bookings, and track status.
*   **Administrator**: Oversee the entire platform, approve/reject hotel submissions, and manage users.

### 🤖 AI Integration
*   **Smart Suggestions**: AI-powered recommendations for alternative accommodations if your preferred choice is unavailable.

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (auth)/       # Authentication routes (login, signup)
│   ├── admin/        # Admin dashboard
│   ├── owner/        # Owner dashboard
│   ├── hotels/       # Hotel search and details
│   ├── flights/      # Flight booking features
│   ├── bus/          # Bus booking features
│   └── ...
├── components/       # Reusable UI components
│   ├── ui/           # ShadCN UI primitives
│   └── ...
├── ai/               # Genkit and AI logic
├── hooks/            # Custom React hooks
└── lib/              # Utility functions and configurations
```

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd hotel
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and add the necessary environment variables. You will need keys for Firebase and Google GenAI.

```env
# Example variables (adjust based on your actual setup)
GOOGLE_GENAI_API_KEY=your_api_key_here
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.
