Spend Smart is a personal expense tracking application designed to help users understand and manage their spending habits. It combines OCR (Optical Character Recognition) technology and AI-based categorization to automatically analyze bills and receipts, making expense tracking effortless and accurate.
Key Features:
- OCR Bill Scanning – Upload bills to automatically extract items and prices using Optical Character Recognition.
- AI Categorization – Automatically categorize purchases (e.g., Dairy, Snacks, Daily Needs) using fuzzy logic and brand filtering.
- Manual Entry – Add expenses manually when needed.
- Friend Split System – Add friends and split bills easily.
- Spending Insights – View categorized summaries to understand where your money goes.

## AI Categorization (Python Backend)
- Preprocesses item names by removing brand names, descriptors, and unnecessary text.
- Uses fuzzy matching to map unknown or noisy items to the closest known category.
- Supports multiple fallback levels: full match → partial match → word-level match → miscellaneous.

  ## OCR Flow
1. User uploads a bill image.
2. Text is extracted using Tesseract.js.
3. Extracted items are passed to the AI for categorization.
4. Categorized items and amounts are saved to the database.

### Frontend (React)
- React with Bootstap CSS

### Backend (Node.js + Express)
- REST API for expenses, user authentication, and friend management
- Uses `python-shell` to call the Python AI script
- Stores transactions in MongoDB

### AI Script (Python)
- Uses `fuzzywuzzy` and `pandas`
- Reads a dataset of known items and categories (`DataSet.csv`)
- Filters brand names and descriptors
Goal: Help users develop better budgeting habits by providing a clear, real-time view of where their money is going.
###Set-up steps 
❖ FOR AI :
● python -m venv myenv ● pip install fuzzy wuzzy● pip install pandas
● ❖ FOR FRONTEND: Prerequisites ● Ensure you have the following installed before proceeding: - Node.js (Latest LTS version recommended) - MongoDB (For database management) - Git ● Clone the Repository (write all this in terminal of vs code) bash git clone https://github.com/Love-M-365/SpendSmart 
●❖ Backend Setup ● Navigate to the backend folder: bash cd backend ● Install dependencies: bash npm  install ● Start the backend server: bash npm run dev ● Frontend Setup ● Navigate to the frontend folder: bash cd ../frontend ● Install dependencies: bash npm install
●Start the frontend: bash npm start(The frontend will run on http://localhost:5173) ● Running the Application Once both frontend and backend are running: - Open http://localhost:5173 in your browser. - The SpendSmart dashboard should be visible.
FUTURE PLANS:
●Export & Import Options:
Enable users to back up or export their data for external analysis or record keeping.
●Gamification:
Introduce reward points or badges for achieving savings goals, staying within budget, and other positive financial habits.
●Mobile App:
Launch a fully functional mobile app (React Native or Flutter) to make the platform more accessible and convenient.
●Voice Input / AI Assistant:
Add voice-driven expense entry — for example, “Add coffee expense of ₹70 to Food” using an AI voice assistant.

Liscence: MIT License
