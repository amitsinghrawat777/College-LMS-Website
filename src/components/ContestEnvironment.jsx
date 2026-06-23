import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, HelpCircle, ArrowLeft, ArrowRight, Save, CheckCircle, ShieldAlert, Award, FileText } from 'lucide-react';
import { contestsData } from '../data/mockData';

export default function ContestEnvironment({ 
  contests,
  setContests,
  activeContestId, 
  setCurrentPage, 
  setSubmissionDetails, 
  triggerNotification 
}) {
  const contest = contests.find(c => c.id === activeContestId) || contests[0];
  const { questions } = contest;

  // Answers and marking states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [tempAnswers, setTempAnswers] = useState({}); // Stores selection state before "Save"
  const [savedAnswers, setSavedAnswers] = useState({}); // Stores saved/locked answers (Green status)
  const [markedForReview, setMarkedForReview] = useState({}); // Stores review markers (Yellow status)
  
  // Violations & UFM State
  const [violationCount, setViolationCount] = useState(0);
  const [violationLogs, setViolationLogs] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [latestViolationReason, setLatestViolationReason] = useState('');
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer State (starts based on durationMinutes, converted to seconds)
  const [timeLeft, setTimeLeft] = useState(contest.durationMinutes * 60);

  // Ref to check if active session is running (to avoid triggering violation after submit or exit)
  const sessionActiveRef = useRef(true);

  // Enter Fullscreen function
  const requestFullscreen = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  };

  // Exit Fullscreen safely
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  // Mount logic: Enter fullscreen immediately on startup
  useEffect(() => {
    sessionActiveRef.current = true;
    requestFullscreen();

    // Trigger notification
    triggerNotification('info', 'Entering secure examination environment. Fullscreen requested.');

    // Watch for manual fullscreen exits
    const handleFullscreenChange = () => {
      if (!sessionActiveRef.current) return;
      
      // If we exit fullscreen and are not currently showing warning or disqualified, trigger violation
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (!showWarningModal && !isDisqualified) {
          triggerUFMViolation("Leaving full-screen mode");
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      triggerNotification('warning', 'Time limit reached. Submitting your contest automatically.');
      handleSubmitContest(true); // Auto submit
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Cheating UFM Event Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!sessionActiveRef.current) return;
      if (document.hidden) {
        triggerUFMViolation("Browser tab switching or window minimization");
      }
    };

    const handleWindowBlur = () => {
      if (!sessionActiveRef.current) return;
      triggerUFMViolation("Lost window focus / window defocus");
    };

    const blockClipboard = (e) => {
      e.preventDefault();
      triggerNotification('danger', 'UFM Warning: Clipboard operations (copy, cut, paste) are disabled.');
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('contextmenu', blockContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, [violationCount, showWarningModal, isDisqualified]);

  // Core UFM Handler
  const triggerUFMViolation = (reason) => {
    if (!sessionActiveRef.current) return;

    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${reason} at ${timestamp}`;
    const nextViolationCount = violationCount + 1;

    setViolationLogs(prev => [...prev, logMessage]);
    setLatestViolationReason(reason);

    if (nextViolationCount >= 2) {
      // 2nd Violation -> Disqualify Student
      setViolationCount(2);
      setIsDisqualified(true);
      sessionActiveRef.current = false;
      exitFullscreen();
      triggerNotification('danger', 'Critical UFM violation limit reached. You are disqualified.');
    } else {
      // 1st Violation -> Show Warning Modal
      setViolationCount(1);
      setShowWarningModal(true);
      triggerNotification('warning', `Proctoring Alert: ${reason}. This is your first warning.`);
    }
  };

  // Close warning modal and re-request fullscreen
  const resumeExam = () => {
    setShowWarningModal(false);
    requestFullscreen();
  };

  // Formatting remaining time (MM:SS)
  const formatTimeLeft = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Question navigation actions
  const selectOption = (optIndex) => {
    setTempAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleSaveAnswer = () => {
    const selectedOption = tempAnswers[currentQIndex];
    if (selectedOption === undefined) {
      triggerNotification('warning', 'Please select an option before saving.');
      return;
    }

    setSavedAnswers(prev => ({
      ...prev,
      [currentQIndex]: selectedOption
    }));
    triggerNotification('success', `Question ${currentQIndex + 1} saved successfully.`);
  };

  const handleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
    triggerNotification('info', markedForReview[currentQIndex] ? `Removed Mark for Review from Q${currentQIndex + 1}` : `Question ${currentQIndex + 1} Marked for Review.`);
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  // Submit Exam
  const handleSubmitContest = (isAuto = false) => {
    sessionActiveRef.current = false;
    exitFullscreen();

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (savedAnswers[idx] !== undefined && savedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const finalScoreStr = `${correctCount * (contest.totalMarks / questions.length)}/${contest.totalMarks}`;

    // Update global contests state
    setContests(prev => prev.map(c => {
      if (c.id === contest.id) {
        return {
          ...c,
          status: 'Completed',
          participationStatus: 'Participated',
          score: finalScoreStr,
          scoreNum: correctCount * (contest.totalMarks / questions.length),
          problemsSolved: correctCount,
          rank: 42
        };
      }
      return c;
    }));

    setSubmissionDetails({
      contestTitle: contest.title,
      subjectName: contest.subject,
      questionsAnswered: Object.keys(savedAnswers).length,
      totalQuestions: questions.length,
      correctCount: correctCount,
      scoreString: finalScoreStr,
      scorePercentage: scorePercentage,
      submissionTime: new Date().toLocaleTimeString(),
      autoSubmitted: isAuto,
      status: 'Awaiting Result Publication'
    });

    setCurrentPage('contest-completed');
  };

  // Disqualification screen component rendering
  if (isDisqualified) {
    return (
      <div className="disqualified-container">
        <div className="dq-card">
          <ShieldAlert size={64} className="dq-icon" />
          <h2 className="dq-title">DISQUALIFIED</h2>
          <p className="dq-text">
            This examination has been terminated due to multiple Unfair Means (UFM) violations.
          </p>
          <div style={{ textAlign: 'left', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#ff6b6b', display: 'block', marginBottom: '8px' }}>
              VIOLATION LOGS:
            </span>
            <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              {violationLogs.map((log, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{log}</li>
              ))}
            </ul>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => setCurrentPage('dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active question loading
  const activeQuestion = questions[currentQIndex] || { text: 'Loading Question...', options: [] };
  const currentTempSelection = tempAnswers[currentQIndex];
  const isQuestionSaved = savedAnswers[currentQIndex] !== undefined;
  const isQuestionMarked = markedForReview[currentQIndex] === true;

  return (
    <div className="contest-env-container animate-fade-in">
      {/* top Header bar */}
      <div className="contest-env-header">
        <div className="env-title-col">
          <span className="env-title">{contest.title}</span>
          <span className="env-subtitle">{contest.subject} • Proctoring Active</span>
        </div>

        {/* Timer, violation pills */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="header-status-pill violations pulsing">
            <ShieldAlert size={16} />
            <span>Violations: {violationCount} / 2</span>
          </div>

          <div className="header-status-pill timer">
            <Clock size={16} />
            <span>{formatTimeLeft()}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="contest-env-body">
        {/* Left Side: Question area */}
        <div className="question-workspace">
          <div className="question-card-wrapper">
            <div>
              <div className="q-header">
                <span className="q-number">Question {currentQIndex + 1} of {questions.length}</span>
                <span className="q-points">+{contest.totalMarks / questions.length} Marks</span>
              </div>

              <p className="q-text">{activeQuestion.text}</p>

              {/* Options */}
              <div className="options-list">
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = currentTempSelection === optIdx;
                  return (
                    <div 
                      key={optIdx}
                      className={`option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectOption(optIdx)}
                    >
                      <div className="option-bullet">
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="option-label">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions footer */}
            <div className="env-actions-row">
              <div className="action-left-group">
                <button 
                  className="btn btn-outline" 
                  disabled={currentQIndex === 0}
                  onClick={handlePrev}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                
                <button 
                  className="btn btn-outline" 
                  disabled={currentQIndex === questions.length - 1}
                  onClick={handleNext}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className={`btn ${isQuestionMarked ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderColor: 'var(--warning)', color: isQuestionMarked ? 'white' : 'var(--warning)', backgroundColor: isQuestionMarked ? 'var(--warning)' : 'transparent' }}
                  onClick={handleMarkReview}
                >
                  <span>Mark for Review</span>
                </button>

                <button 
                  className="btn btn-outline"
                  style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                  onClick={handleSaveAnswer}
                >
                  <Save size={16} />
                  <span>Save Answer</span>
                </button>

                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--danger)', color: 'white' }}
                  onClick={() => setShowSubmitConfirm(true)}
                >
                  <span>Submit Contest</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation sidebar drawer */}
        <div className="env-sidebar">
          <div className="env-sidebar-section">
            <h4 className="env-sidebar-title">Question Navigator</h4>
            <div className="q-grid">
              {questions.map((_, idx) => {
                const isAnswered = savedAnswers[idx] !== undefined;
                const isMarked = markedForReview[idx] === true;
                const isCurrent = currentQIndex === idx;
                
                let btnClass = '';
                if (isAnswered) btnClass = 'answered';
                else if (isMarked) btnClass = 'marked';
                if (isCurrent) btnClass += ' current-select';

                return (
                  <button 
                    key={idx}
                    className={`q-grid-btn ${btnClass}`}
                    onClick={() => setCurrentQIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="env-sidebar-section" style={{ flex: 1 }}>
            <h4 className="env-sidebar-title">Legend</h4>
            <ul className="legend-list">
              <li className="legend-item">
                <div className="legend-dot unvisited"></div>
                <span>Unanswered / Unvisited</span>
              </li>
              <li className="legend-item">
                <div className="legend-dot answered"></div>
                <span>Answered & Saved</span>
              </li>
              <li className="legend-item">
                <div className="legend-dot marked"></div>
                <span>Marked for Review</span>
              </li>
            </ul>
          </div>

          <div className="env-sidebar-section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Answered:</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>{Object.keys(savedAnswers).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <span>Marked Review:</span>
              <span style={{ fontWeight: '700', color: 'var(--warning)' }}>{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <span>Total Questions:</span>
              <span style={{ fontWeight: '700' }}>{questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Overlay Modal for 1st violation */}
      {showWarningModal && (
        <div className="overlay-modal-backdrop">
          <div className="modal-content-box">
            <AlertTriangle size={48} className="modal-icon-warning" />
            <h3 className="modal-title">PROCTORING WARNING</h3>
            <p className="modal-text">
              A proctoring violation has been logged: <strong>{latestViolationReason}</strong>.
              <br /><br />
              Please return to full-screen mode immediately. If you trigger another violation, your exam will be terminated immediately.
            </p>
            <button 
              className="btn btn-primary animate-pulse" 
              style={{ width: '100%' }}
              onClick={resumeExam}
            >
              I Understand, Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="overlay-modal-backdrop">
          <div className="modal-content-box" style={{ borderColor: 'var(--primary)' }}>
            <HelpCircle size={48} className="modal-icon-warning" style={{ color: 'var(--primary)' }} />
            <h3 className="modal-title">Confirm Exam Submission</h3>
            <p className="modal-text">
              Are you sure you want to end and submit your contest? You have answered {Object.keys(savedAnswers).length} out of {questions.length} questions.
              Once submitted, you cannot review your answers.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1.5 }}
                onClick={() => handleSubmitContest(false)}
              >
                Submit Contest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
