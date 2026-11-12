# AI-Powered Agile Code Analyzer ⚡

An enterprise-grade, full-stack MERN application that provides automated, structured AI code reviews, vulnerability detection, and instant Agile Sprint Task backlog generation powered strictly by **Google Gemini**.

---

## 🌟 Key Features

1. **AI Code Review via Google Gemini**: Authenticated developers paste source code, choose their target language and analysis focus, and receive an instant, structured code audit.
2. **Zero-Execution Code Sandboxing**: Treats all source code strictly as inert data to prevent prompt injection and security exploits. Source code is never executed.
3. **Automated Agile Sprint Backlog**: Automatically transforms findings into prioritized Jira/Linear-ready sprint stories (Bug Fixes, Security Hardening, Performance Optimizations, Refactoring, and Test Coverage) with acceptance criteria.
4. **Interactive Code Finding Cards**: Line-level code evidence, actionable recommendations, and suggested code replacement blocks with 1-click clipboard copy.
5. **Private Paginated History & Archive**: Search, filter by language, status, severity, and date with isolation between user workspaces.
6. **Robust Security Stack**: JWT in `httpOnly` secure cookies, bcrypt password hashing, helmet HTTP headers, strict CORS, express-rate-limit on auth and analysis endpoints, and Zod input/output schemas.

---

## 🏗️ Folder Structure

```
Report file/
├── client/                               # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/                   # Navbar, CodeEditor, FindingCard, SeverityBadge, Loader, ProtectedRoute, AgileTasksModal
│   │   ├── features/auth/                # AuthContext, authReducer
│   │   ├── hooks/                        # useAuth, useAnalyses
│   │   ├── pages/                        # Landing, Login, Register, Dashboard, Analyze, AnalysisDetail, History
│   │   ├── routes/                       # AppRoutes.jsx
│   │   ├── services/                     # api.js, authService.js, analysisService.js
│   │   ├── App.jsx                       # Root application layout
│   │   ├── index.css                     # Dark-mode design system & animations
│   │   └── main.jsx                      # React entrypoint
│   ├── index.html                        # HTML template with typography
│   ├── package.json                      # Client dependencies & scripts
│   └── vite.config.js                    # Vite configuration with API proxy
├── server/                               # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                       # env.js, db.js, constants.js
│   │   ├── controllers/                  # authController.js, analysisController.js, healthController.js
│   │   ├── middleware/                   # auth.js, rateLimiter.js, validate.js, errorHandler.js, requestId.js
│   │   ├── models/                       # User.js, Analysis.js
│   │   ├── routes/                       # authRoutes.js, analysisRoutes.js, healthRoutes.js, index.js
│   │   ├── services/                     # geminiService.js, analysisService.js, authService.js
│   │   ├── utils/                        # AppError.js, logger.js, asyncHandler.js
│   │   ├── validators/                   # authValidators.js, analysisValidators.js, aiResponseSchema.js
│   │   └── app.js                        # Express application configuration
│   ├── tests/                            # Jest + Supertest integration tests
│   │   ├── auth.test.js                  # Authentication & session tests
│   │   └── analysis.test.js              # Isolation, pagination, and Gemini mock tests
│   ├── .env                              # Environment variables for the application
│   ├── package.json                      # Server dependencies & scripts
│   └── server.js                         # Database bootstrap & HTTP server entrypoint
├── .gitignore                            # Git ignore rules
├── package.json                          # Root package.json with unified scripts
├── postman_collection.json               # Full Postman v2.1 collection for all endpoints
└── README.md                             # Complete project documentation
```

---

## ⚙️ Environment Variables Table

| Variable | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP server port | `5000` | `5000` |
| `NODE_ENV` | Environment mode | `development` | `production` |
| `MONGODB_URI` / `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/ai-code-analyzer` | `mongodb://localhost:27017/ai-code-analyzer` |
| `JWT_SECRET` / `ACCESS_TOKEN` | Secret key for signing JWTs | *(Internal fallback)* | `min_32_character_super_secret_jwt_key` |
| `JWT_EXPIRES_IN` | JWT cookie lifetime | `7d` | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS frontend origin | `http://localhost:5173` | `http://localhost:5173` |
| `GEMINI_API_KEY` / `AI_GEMINI_TOKEN_KEY` | Google Gemini API Key | *(Required)* | `AQ.Ab8RN6KL...` |
| `GEMINI_MODEL` | Google Gemini model name | `gemini-1.5-flash` | `gemini-1.5-flash` |
| `MAX_CODE_LENGTH` | Maximum characters permitted in code snippet | `25000` | `25000` |
| `MAX_FINDINGS` | Maximum findings stored per review | `30` | `30` |
| `AI_TIMEOUT_MS` | Timeout for AI request before failing | `30000` | `30000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting sliding window (ms) | `900000` (15 min) | `900000` |
| `RATE_LIMIT_MAX` | Global API requests per window | `100` | `100` |
| `ANALYSIS_RATE_LIMIT_MAX` | Code analyses permitted per window | `20` | `20` |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v22 LTS recommended)
- **MongoDB**: Local MongoDB server running on port `27017` or MongoDB Atlas URI
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
Install all dependencies across the server and client:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Configure the application using the single `server/.env` file. Set `GEMINI_API_KEY`
to your Google AI Studio key and update the MongoDB URI and JWT secret as needed.
The client uses the server's API proxy and does not need a separate `.env` file.

### 3. Run Development Servers
From the root directory, or individually:

#### Start Server (Port 5000):
```bash
cd server
npm run dev
```

#### Start Client (Port 5173):
```bash
cd client
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 📡 REST API Reference (`/api/v1`)

Response envelope format:
- **Success**: `{ "data": { ... } }`
- **Error**: `{ "error": { "code": "...", "message": "...", "details": [] } }`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/v1/auth/register` | Register new user & set `httpOnly` cookie | No | Yes (15 / 15m) |
| `POST` | `/api/v1/auth/login` | Log in user & set `httpOnly` cookie | No | Yes (15 / 15m) |
| `POST` | `/api/v1/auth/logout` | Clear session cookie | No | No |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile | **Yes** | No |

### Analysis Endpoints
| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/v1/analyses` | Submit code snippet to Gemini AI | **Yes** | Yes (20 / 15m) |
| `GET` | `/api/v1/analyses` | Paginated history with filter query params | **Yes** | No |
| `GET` | `/api/v1/analyses/:id` | Get report details with Agile Sprint Tasks | **Yes** | No |
| `DELETE` | `/api/v1/analyses/:id` | Delete report (isolated to owning user) | **Yes** | No |
| `PATCH` | `/api/v1/analyses/:id/findings/:findingId` | Update finding status (`open`, `accepted`, `resolved`, `dismissed`) | **Yes** | No |

### Health Check Endpoint
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | Uptime, database connection, and environment state | No |

---

## 🧪 Running Automated Tests

Run the full integration test suite with Jest and Supertest:
```bash
cd server
npm test
```

### Test Coverage Includes:
- **Authentication Lifecycle**: User registration, duplicate email rejection (`409`), password validation (`422`), login authentication, session cookies, and logout.
- **Route Protection**: Verifies `401 Unauthorized` is returned for unauthenticated requests.
- **Cross-User Data Isolation**: Verifies that User A cannot read or delete User B's analyses (strictly returns `404 Not Found`).
- **Input Validation**: Verifies that invalid language names or oversized payloads are rejected *before* any AI provider call.
- **AI Failure Resilience**: Simulates Gemini timeouts/errors and verifies the record is saved with status `failed` (never prematurely marked `completed`).
- **Pagination & Ordering**: Verifies newest-first sorting and limit/skip controls.
- **Document Deletion**: Confirms database documents are deleted upon request.

---

## 🛡️ Security & Prompt Injection Defenses

1. **Inert Data Sandboxing**: Code inputs are isolated inside XML demarcation tags (`<SOURCE_CODE>`) with explicit system rules instructing Gemini to treat input purely as inert text and ignore instructions or role changes.
2. **Strict Zod Parsing**: AI outputs are validated using `aiResponseSchema` with bounded line checks and limits on finding counts.
3. **No Raw HTML Execution**: Neither the server nor the React client ever renders raw HTML or executes arbitrary source code.
4. **Credential Redaction**: Internal loggers automatically redact sensitive fields (`password`, `token`, `authorization`, `cookie`, `apiKey`, and source code contents).
#   A i - c o d e - a n a l y z e r -  
 