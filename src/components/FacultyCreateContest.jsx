import React, { useState } from 'react';
import { FileText, Plus, Trash, HelpCircle, Save, Check } from 'lucide-react';

export default function FacultyCreateContest({ setContests, setCurrentPage, triggerNotification }) {
  // Contest Metadata
  const [contestName, setContestName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('60 Mins');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingCriteria, setPassingCriteria] = useState('50% Marks');

  // Dynamic Question Management
  const [questions, setQuestions] = useState([]);
  
  // Current question builder state
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('MCQ'); // MCQ, Coding, Descriptive
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  const handleAddQuestion = () => {
    if (!qText.trim()) {
      triggerNotification('danger', 'Please enter the question prompt text.');
      return;
    }

    const newQuestion = {
      id: `q-dynamic-${Date.now()}`,
      text: qText,
      type: qType,
      options: qType === 'MCQ' ? [...mcqOptions] : null,
      correctAnswer: qType === 'MCQ' ? correctOptionIndex : null
    };

    setQuestions(prev => [...prev, newQuestion]);
    triggerNotification('success', 'Question added to contest build list.');
    
    // Reset builder inputs
    setQText('');
    setMcqOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    triggerNotification('info', 'Question removed from list.');
  };

  const handlePublishContest = (e) => {
    e.preventDefault();

    if (!contestName.trim() || !subject.trim() || !startDate || !endDate) {
      triggerNotification('danger', 'Please fill out all required contest details.');
      return;
    }

    if (questions.length === 0) {
      triggerNotification('danger', 'You must add at least one question to publish a contest.');
      return;
    }

    const newContestId = `contest-${Date.now()}`;
    const newContest = {
      id: newContestId,
      title: contestName,
      subject: subject,
      faculty: 'Dr. Anirban Sen',
      difficulty: difficulty,
      duration: duration,
      durationMinutes: parseInt(duration) || 60,
      totalQuestions: questions.length,
      totalMarks: Number(totalMarks),
      passingCriteria: passingCriteria,
      startTime: startDate.replace('T', ' '),
      endTime: endDate.replace('T', ' '),
      status: 'Active',
      participationStatus: 'Not Participated',
      date: startDate.split('T')[0],
      description: description,
      rules: [
        'Full-screen mode is mandatory during the entire exam session.',
        'Tab switching is prohibited and will trigger automatic warnings.',
        'Leaving full-screen mode or minimizing the browser window is prohibited.',
        'Multiple browser tabs or windows are strictly not allowed.',
        'Copy, paste, cut, and right-click actions are disabled on the interface.',
        'Any unfair activity detected by the UFM system will result in instant disqualification.',
        'Once disqualified, you will be locked out and not allowed to rejoin the contest.'
      ],
      questions: [...questions]
    };

    setContests(prev => [newContest, ...prev]);
    triggerNotification('success', `Contest "${contestName}" successfully published! 🚀`);
    setCurrentPage('faculty-dashboard');
  };

  return (
    <div className="page-container animate-fade-in" style={{ padding: '32px 40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '850', color: 'var(--logo-title-color)', letterSpacing: '-0.02em', margin: 0 }}>
            Create Contest
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Build custom exams with metadata, MCQ, descriptive, or coding environments.
          </p>
        </div>
      </div>

      <form onSubmit={handlePublishContest} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Step 1: Metadata details */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '750', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', color: 'var(--text-primary)' }}>
            1. Contest Specifications
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            
            {/* Contest Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Contest Name *</label>
              <input
                type="text"
                placeholder="e.g. End Semester MCQ Assessment"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* Subject */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Subject / Category *</label>
              <input
                type="text"
                placeholder="e.g. Java, Data Structures, Web Development"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* Duration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Duration (e.g. "60 Mins") *</label>
              <input
                type="text"
                placeholder="60 Mins"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* End Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>End Date & Time *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* Difficulty */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              placeholder="Provide context or syllabus details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Step 2: Add Questions */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '750', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', color: 'var(--text-primary)' }}>
            2. Question Builder
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* Input Side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {/* Question Type Toggle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Question Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  >
                    <option value="MCQ">Multiple Choice Question (MCQ)</option>
                    <option value="Coding">Coding Environment Challenge</option>
                    <option value="Descriptive">Descriptive Answer Prompt</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Question Prompt Text</label>
                <textarea
                  placeholder="Enter the actual question statement..."
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={3}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Dynamic options if MCQ */}
              {qType === 'MCQ' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Options and Correct Flag</label>
                  {mcqOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="correctFlag"
                        checked={correctOptionIndex === idx}
                        onChange={() => setCorrectOptionIndex(idx)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMcqOptions(prev => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-color)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Add Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddQuestion}
                style={{ padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'fit-content' }}
              >
                <Plus size={16} />
                <span>Add Question to List</span>
              </button>

            </div>

            {/* Questions preview side */}
            <div 
              style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                border: '1.5px dashed var(--border-color)', 
                borderRadius: '16px',
                padding: '20px',
                minHeight: '260px'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                Contest Questions ({questions.length})
              </span>
              {questions.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: 'var(--text-tertiary)', gap: '8px' }}>
                  <HelpCircle size={32} />
                  <span style={{ fontSize: '0.85rem' }}>No questions built yet.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {questions.map((q, idx) => (
                    <div 
                      key={q.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 14px', 
                        backgroundColor: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '10px' 
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Q{idx + 1}. {q.text.substring(0, 36)}...</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600' }}>Type: {q.type}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteQuestion(q.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => setCurrentPage('faculty-dashboard')}
            style={{ padding: '12px 24px', borderRadius: '12px', border: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '12px 28px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} />
            <span>Publish Contest</span>
          </button>
        </div>

      </form>
    </div>
  );
}
