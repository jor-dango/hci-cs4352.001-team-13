# Contract Privacy Analyzer

A React Native mobile application for analyzing contracts with a focus on privacy concerns. Built with Expo for cross-platform compatibility.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (macOS) or Android Emulator
- Python 3.8+ (for backend)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on a platform:**
   - iOS: `npm run ios` (macOS only)
   - Android: `npm run android`
   - Web: `npm run web`

### Backend Setup

The Flask backend API must be running for file upload and analysis features to work.

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The server will run on `http://0.0.0.0:5001`

4. **Update backend URL (if needed):**
   - For physical devices, update `BACKEND_URL` in the following files to use your local network IP:
     - `app/(tabs)/upload/index.tsx`
     - `app/(tabs)/upload/analysis.tsx`
     - `app/(tabs)/upload/comparison.tsx`
     - `app/(tabs)/history.tsx`
   - Example: `const BACKEND_URL = "http://192.168.1.100:5001";`

## 📱 Tech Stack

### Frontend
- **React Native** 0.81.5
- **Expo** 54
- **TypeScript** (strict mode)
- **Expo Router** 6 (file-based routing)
- **expo-linear-gradient** (for UI gradients)

### Backend
- **Flask** (Python)
- **Port**: 5001
- **CORS**: Enabled for cross-origin requests

## 🏗️ Project Structure

```
app/
├── _layout.tsx              # Root layout with theme provider
├── (tabs)/                  # Tab navigation group
│   ├── _layout.tsx          # Tab bar configuration
│   ├── index.tsx            # Redirect to upload tab
│   ├── history.tsx          # Contract history view
│   ├── settings.tsx         # Settings (placeholder for team)
│   └── upload/              # Upload stack
│       ├── _layout.tsx      # Stack navigator
│       ├── index.tsx        # File upload screen
│       ├── analysis.tsx     # Contract analysis & chat
│       └── comparison.tsx   # Contract comparison
│
components/
├── ui/
│   ├── action-button-pair.tsx  # Button pair component
│   ├── comparison-modal.tsx    # Contract selection modal
│   └── history-card.tsx        # History list item
│
constants/
└── theme.ts                 # Global styles & colors

backend/
├── app.py                   # Flask API server
├── requirements.txt         # Python dependencies
└── uploads/                 # Uploaded files directory
```

## 🎨 Design System

### Colors
- **Primary Brand**: `#383AB2`
- **Background**: `#EDEDF0`
- **Borders**: `#BEBEBE`
- **Text**: `#2C2C2C`
- **Secondary Text**: `#6B7280`

### Typography (GlobalStyles)
- **h3**: 36px serif (headings)
- **body**: 16px sans (body text)
- **small**: 14px sans (secondary text)

### Spacing
- **Gap between sections**: 24px
- **Padding**: 24px horizontal, 16px top
- **Bottom padding**: 80px (for scroll gradients)

## 🔑 Key Features

### ✅ Implemented
- File upload (PDF, DOCX, JPG, PNG)
- Contract analysis display
- Privacy rating system
- AI chat interface for questions
- Contract comparison
- History view with archived contracts
- Save to archive functionality
- Scroll indicator gradients
- Consistent UI/UX across all screens
- Proper navigation stack management

### 🚧 To Be Implemented
- Settings screen content
- Camera-based document capture
- Real AI integration (currently mocked)
- Dark mode toggle
- Push notifications

## 📝 Development Notes

### Navigation
- Uses standard `Tabs` from `expo-router` (not NativeTabs)
- Upload tab contains a nested stack (index → analysis → comparison)
- History navigation properly clears upload stack to prevent confusion
- All screens use `edges={['top']}` on SafeAreaView to avoid bottom padding

### State Management
- Local state with React hooks
- No global state management (consider adding Redux/Zustand if needed)

### API Integration
- Backend endpoints:
  - `POST /upload` - Upload contract file
  - `GET /upload/:filename` - Get file metadata
  - `PATCH /upload/:filename/archive` - Archive a contract
  - `DELETE /upload/:filename` - Delete a file
  - `GET /uploads?archived=true` - List archived contracts

### File Upload Flow
1. User selects file via modal
2. File uploaded to backend with FormData
3. Navigate to analysis screen with filename param
4. Analysis screen fetches metadata from backend
5. User can save to archive or ask questions

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🐛 Troubleshooting

### App shows "Unmatched Route"
- Make sure all navigation changes are saved
- Clear Metro bundler cache: `npm start --clear`
- Reload app: shake device → "Reload"

### Backend connection fails
- Ensure Flask server is running on port 5001
- Check `BACKEND_URL` matches your network IP
- Verify CORS is enabled in `backend/app.py`
- Check firewall settings

### Gradient not visible
- Run `npm install` to ensure expo-linear-gradient is installed
- Reload the app after installation

### iOS/Android build issues
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`

## 👥 Team Development

### For New Developers

1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Start both frontend and backend servers
4. Check `CLAUDE.md` for AI assistant guidance

### Settings Screen TODO
The settings screen (`app/(tabs)/settings.tsx`) is currently a placeholder. Suggested features:
- User preferences
- Notification settings
- Data & storage management
- Clear history
- About/version info
- Terms & privacy policy links

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 📄 License

Educational project for HCI CS 4352.001 - Team 13

---

**Last Updated**: November 2024
**Status**: In Active Development
