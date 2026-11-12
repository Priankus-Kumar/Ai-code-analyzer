import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor.jsx';
import Loader from '../components/Loader.jsx';
import analysisService from '../services/analysisService.js';

const SAMPLE_CODES = {
  javascript: `// Express Auth Middleware with potential vulnerability
function authenticate(req, res, next) {
  var token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send("No token");
  }
  
  // Potential security vulnerability: missing algorithm specification
  jwt.verify(token, "hardcoded_jwt_secret", function(err, decoded) {
    if (err) {
      return res.status(403).send("Failed auth");
    }
    req.user = decoded;
    next();
  });
}`,
  typescript: `// TypeScript User Service with insecure typing & missing error handling
interface UserProfile {
  id: string;
  role: any; // Insecure 'any' bypasses type safety
}

export async function fetchUserData(userId: string): Promise<UserProfile> {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();
  return data as UserProfile;
}`,
  python: `# Flask SQL endpoint with potential SQL Injection
@app.route('/user/search')
def search_user():
    user_input = request.args.get('name')
    # Unsanitized string formatting
    query = f"SELECT * FROM users WHERE username = '{user_input}'"
    cursor.execute(query)
    results = cursor.fetchall()
    return jsonify(results)`,
  go: `package main

import (
	"fmt"
	"net/http"
)

// Inefficient memory allocation in handler
func handleRequest(w http.ResponseWriter, r *http.Request) {
	data := make([]byte, 10000000) // Allocates 10MB per request
	fmt.Fprintf(w, "Allocated %d bytes", len(data))
}`,
  java: `// Java User Repository with potential resource leak
public class UserRepository {
    public User findById(String id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/app", "root", "password");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = '" + id + "'");
        if (rs.next()) {
            return new User(rs.getString("username"));
        }
        return null;
    }
}`,
  cpp: `// C++ Buffer operations with potential buffer overflow
#include <iostream>
#include <cstring>

void processPayload(const char* input) {
    char buffer[64];
    // Dangerous unchecked string copy
    strcpy(buffer, input);
    std::cout << "Buffer: " << buffer << std::endl;
}`,
  csharp: `// C# Data Access with raw SQL injection vulnerability
public class AccountService {
    public Account GetAccount(string accountNumber) {
        string query = "SELECT * FROM Accounts WHERE AccountNumber = '" + accountNumber + "'";
        using (var cmd = new SqlCommand(query, _connection)) {
            return Execute(cmd);
        }
    }
}`,
  rust: `// Rust Concurrent queue with unhandled unwrap panic
use std::sync::mpsc;
use std::thread;

pub fn process_queue() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let msg = rx.recv().unwrap(); // Potential panic on broken channel
        println!("Received: {}", msg);
    });
}`,
  php: `<?php
// PHP login check with md5 hashing and raw input concatenation
$username = $_POST['username'];
$password = md5($_POST['password']);

$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $query);
?>`,
  ruby: `# Ruby API Controller with command execution vulnerability
class BackupController < ApplicationController
  def create
    filename = params[:filename]
    # Dangerous shell injection via backticks
    output = \`tar -czf /backups/#{filename}.tar.gz /data\`
    render json: { result: output }
  end
end`,
  sql: `-- Unindexed join and wide wildcard selection
SELECT *
FROM transactions t
LEFT JOIN customers c ON t.customer_id = c.id
WHERE t.created_at >= '2026-01-01'
ORDER BY t.created_at DESC;`,
  html: `<!-- Legacy HTML form with missing CSRF and autocomplete vulnerabilities -->
<form action="/login" method="POST">
  <input type="text" name="username" placeholder="Username" />
  <input type="password" name="password" placeholder="Password" />
  <button type="submit">Log In</button>
</form>`,
  css: `/* Non-responsive fixed layout with performance-heavy universal selectors */
* {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.container {
  width: 1200px;
  position: absolute;
  top: 100px;
}`,
  shell: `#!/bin/bash
# Bash script with unquoted variables and unsafe eval
TARGET_DIR=$1
echo "Cleaning directory: $TARGET_DIR"
rm -rf $TARGET_DIR/*
eval "echo Operation completed for: $TARGET_DIR"`
};

export const Analyze = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [focus, setFocus] = useState('general');
  const [sourceCode, setSourceCode] = useState(SAMPLE_CODES.javascript);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const isCurrentSample = Object.values(SAMPLE_CODES).includes(sourceCode);
    setLanguage(newLang);
    if (isCurrentSample && SAMPLE_CODES[newLang]) {
      setSourceCode(SAMPLE_CODES[newLang]);
    }
  };

  const handleLoadSample = (lang) => {
    setLanguage(lang);
    setSourceCode(SAMPLE_CODES[lang] || '');
  };

  const handleClearCode = () => {
    setSourceCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sourceCode.trim()) {
      setError('Please provide source code to analyze.');
      return;
    }

    if (sourceCode.length > 25000) {
      setError('Source code exceeds maximum length limit of 25,000 characters.');
      return;
    }

    setAnalyzing(true);
    try {
      const data = await analysisService.createAnalysis({
        title: title.trim() || undefined,
        language,
        focus,
        sourceCode
      });

      const analysisId = data.analysis?._id || data.analysis?.id || data?._id || data?.id;
      if (!analysisId) {
        throw new Error('Analysis report ID missing from server response.');
      }
      navigate(`/analyses/${analysisId}`);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your AI API key and connection.');
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return <Loader showProgressStages={true} />;
  }

  return (
    <div className="analyze-page">
      {/* Page Header */}
      <div className="analyze-header">
        <div>
          <h1 className="analyze-title">Launch Agile Code Analysis</h1>
          <p className="analyze-subtitle">
            Submit code for an in-depth AI architectural review, security scan, and agile sprint backlog extraction.
          </p>
        </div>

        {/* Quick Sample Load Buttons */}
        <div className="sample-loaders">
          <span className="sample-label">Load Sample:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('javascript')}
            className={`btn btn-secondary btn-sm ${language === 'javascript' ? 'active' : ''}`}
          >
            JavaScript
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('python')}
            className={`btn btn-secondary btn-sm ${language === 'python' ? 'active' : ''}`}
          >
            Python
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('go')}
            className={`btn btn-secondary btn-sm ${language === 'go' ? 'active' : ''}`}
          >
            Go
          </button>
          <button
            type="button"
            onClick={handleClearCode}
            className="btn btn-secondary btn-sm"
            title="Clear editor"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert-error" role="alert" aria-live="assertive">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="error-content">
            <strong>Analysis Request Failed:</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Form */}
      <form onSubmit={handleSubmit} className="analyze-form">
        {/* Controls Bar */}
        <div className="controls-grid glass-card">
          <div className="control-item">
            <label htmlFor="title" className="form-label">
              Analysis Title (Optional)
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Auth Controller Refactor & Security Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="form-input"
            />
          </div>

          <div className="control-item">
            <label htmlFor="language" className="form-label">
              Programming Language
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="form-select"
            >
              <option value="javascript">JavaScript (Node / ES6)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="sql">SQL</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="shell">Shell / Bash</option>
            </select>
          </div>

          <div className="control-item">
            <label htmlFor="focus" className="form-label">
              Analysis Focus Area
            </label>
            <select
              id="focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="form-select"
            >
              <option value="general">Comprehensive General Review</option>
              <option value="security">Security & Vulnerability Auditing</option>
              <option value="bugs">Bug Detection & Edge Cases</option>
              <option value="performance">Performance & Latency Optimization</option>
              <option value="readability">Code Cleanliness & Style</option>
              <option value="maintainability">Architecture & Maintainability</option>
            </select>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="editor-wrapper">
          <CodeEditor
            value={sourceCode}
            onChange={setSourceCode}
            language={language}
            minHeight="420px"
          />
        </div>

        {/* Privacy Notice Banner */}
        <div className="privacy-banner glass-card">
          <div className="privacy-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="privacy-text">
            <strong>Privacy & Security Disclosure:</strong>
            <span>
              Your source code is transmitted strictly as inert data to our backend Google Gemini AI model for review. Code is never executed, cached publicly, or used to train third-party public models.
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="submit-row">
          <button
            type="submit"
            className="btn btn-primary btn-lg start-analysis-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Run Gemini Code Review</span>
          </button>
        </div>
      </form>

      <style>{`
        .analyze-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .analyze-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .analyze-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .analyze-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .sample-loaders {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .sample-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          font-weight: 500;
        }
        .alert-error {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-md);
          color: #fca5a5;
        }
        .error-content p {
          font-size: 0.875rem;
          margin-top: 0.25rem;
          color: #fecaca;
        }
        .analyze-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .controls-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
        }
        .control-item {
          display: flex;
          flex-direction: column;
        }
        .privacy-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(15, 23, 42, 0.5);
          border-left: 3px solid #818cf8;
        }
        .privacy-icon {
          color: #818cf8;
          flex-shrink: 0;
        }
        .privacy-text {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .privacy-text strong {
          color: var(--text-main);
          margin-right: 0.35rem;
        }
        .submit-row {
          display: flex;
          justify-content: flex-end;
        }
        .start-analysis-btn {
          min-width: 240px;
        }
        @media (max-width: 880px) {
          .controls-grid {
            grid-template-columns: 1fr;
          }
          .submit-row {
            justify-content: stretch;
          }
          .start-analysis-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Analyze;
