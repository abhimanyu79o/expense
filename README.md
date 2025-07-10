# Voting Application 🗳️

A full-stack voting application built with React.js (frontend) and Node.js/Express (backend) featuring real-time results, countdown voting, and admin dashboard.

## Features

### 👤 User Features
- **View Nominees**: Browse all nominees with their photos and current vote counts
- **Countdown Voting**: 10-second countdown timer when voting
- **Audio Feedback**: Beep sound plays when vote is submitted
- **Real-time Results**: Live vote count updates and percentages
- **Visual Progress**: Progress bars and vote distribution charts

### 🛠️ Admin Dashboard
- **Secure Login**: Admin authentication (ID: ADMIN, Password: 1234)
- **Nominee Management**: Add, edit, and delete nominees
- **Live Results**: Real-time pie chart using Chart.js
- **Vote Analytics**: Detailed vote counts and statistics
- **Image Upload**: Support for logo/image URLs

### 💾 Backend Features
- **RESTful API**: Express.js with comprehensive endpoints
- **In-Memory Storage**: Fast data storage and retrieval
- **Real-time Updates**: Automatic data synchronization
- **Admin Security**: Basic authentication system

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5000`

## Usage

### Voting Process
1. Visit the main page to see all nominees
2. Click "Vote for [Nominee Name]" to start voting
3. A 10-second countdown begins
4. You can cancel during the countdown
5. When timer reaches 0, a beep plays and your vote is submitted
6. Results update in real-time

### Admin Access
1. Navigate to `/admin` or click "Admin" in the header
2. Login with:
   - **Username**: ADMIN
   - **Password**: 1234
3. Access the dashboard to:
   - Add new nominees
   - Edit existing nominees
   - Delete nominees
   - View live results in pie chart format

### API Endpoints

#### Public Endpoints
- `GET /api/nominees` - Get all nominees
- `POST /api/vote` - Submit a vote
- `GET /api/results` - Get voting results

#### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/nominees` - Create nominee
- `PUT /api/admin/nominees/:id` - Update nominee
- `DELETE /api/admin/nominees/:id` - Delete nominee
- `GET /api/admin/results` - Get detailed results
- `GET /api/admin/votes` - Get all votes

## Technology Stack

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **TanStack Query** - Data fetching
- **Recharts** - Chart visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **In-memory storage** - Data persistence

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/
│   └── schema.ts         # Shared type definitions
└── package.json
```

## Sample Data

The application comes pre-loaded with sample nominees:
- Alice Johnson
- Bob Smith  
- Carol Davis
- David Wilson

## Development

### Building for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run check
```

## Features Showcase

### 🎯 Voting Experience
- **10-second countdown** with visual progress bar
- **Cancel option** during countdown
- **Audio feedback** when vote is submitted
- **Real-time updates** across all connected clients

### 📊 Admin Dashboard
- **Live pie chart** showing vote distribution
- **Nominee management** with image preview
- **Real-time statistics** and analytics
- **Responsive design** for all devices

### 🔒 Security
- Admin authentication
- Input validation
- Error handling
- Secure API endpoints

## License

MIT License - feel free to use this project for learning and development!

---

**Happy Voting! 🗳️**