import React, { useState } from 'react';
import { Calendar, Trash, Users, ShieldAlert, Award, FileText, ChevronDown, ChevronUp, Download, X, BarChart3, AlertTriangle } from 'lucide-react';

export default function FacultyManageContest({ contests, setContests, triggerNotification }) {
  const [expandedContestId, setExpandedContestId] = useState(null);
  const [selectedContestForReport, setSelectedContestForReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleDeleteContest = (contestId, contestTitle) => {
    if (window.confirm(`Are you sure you want to permanently delete "${contestTitle}"? This action is irreversible.`)) {
      setContests(prev => prev.filter(c => c.id !== contestId));
      triggerNotification('success', `Contest "${contestTitle}" deleted successfully.`);
    }
  };

  const toggleExpandContest = (contestId) => {
    setExpandedContestId(expandedContestId === contestId ? null : contestId);
  };

  // Mock participant and UFM violations report data
  const mockParticipants = [
    { name: 'Aarav Sharma', id: '23210101150', score: '85/100', status: 'Completed', violations: 1, logs: ['11:15 AM - Unfocused browser window switch alert issued'] },
    { name: 'Aditya Patel', id: '23210101155', score: '92/100', status: 'Completed', violations: 0, logs: [] },
    { name: 'Neha Gupta', id: '23210101160', score: '0/100', status: 'Terminated', violations: 2, logs: ['02:14 PM - Tab switch warning issued', '02:18 PM - Second browser escape; contest terminated automatically.'] },
    { name: 'Rohan Sen', id: '23210101168', score: 'Awaiting', status: 'In Progress', violations: 0, logs: [] }
  ];

  const getAnalytics = (contest, participants) => {
    let totalParticipated = participants.length;
    let totalCompleted = participants.filter(p => p.status === 'Completed').length;
    let totalTerminated = participants.filter(p => p.status === 'Terminated').length;
    let totalViolations = participants.reduce((acc, p) => acc + p.violations, 0);
    
    // Parse scores for numeric calculations
    const numericScores = participants
      .map(p => {
        if (!p.score || p.score === 'Awaiting') return 0;
        const match = p.score.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      
    const totalScoreNum = numericScores.reduce((acc, s) => acc + s, 0);
    const avgScore = totalParticipated > 0 ? totalScoreNum / totalParticipated : 0;
    const highestScore = totalParticipated > 0 ? Math.max(...numericScores) : 0;
    const lowestScore = totalParticipated > 0 ? Math.min(...numericScores) : 0;
    
    // Sort performers to get top 10
    const sortedParticipants = [...participants].sort((a, b) => {
      const scoreA = a.score && a.score !== 'Awaiting' ? parseInt(a.score.split('/')[0], 10) : 0;
      const scoreB = b.score && b.score !== 'Awaiting' ? parseInt(b.score.split('/')[0], 10) : 0;
      return scoreB - scoreA;
    });
    const topPerformers = sortedParticipants.slice(0, 10);
    
    return {
      totalParticipated,
      totalCompleted,
      totalTerminated,
      totalViolations,
      avgScore,
      highestScore,
      lowestScore,
      topPerformers
    };
  };

  const handleOpenReportModal = (contest) => {
    setSelectedContestForReport(contest);
    setShowReportModal(true);
  };

  const handleDownloadExcel = (contest, participants, analytics, violations) => {
    let csvContent = '\uFEFF'; // UTF-8 BOM to prevent Excel encoding issues
    csvContent += `Campus Contest Portal - Consolidated Contest Report\n`;
    csvContent += `Official Examination & Assessment Report\n\n`;
    
    csvContent += `CONTEST INFORMATION\n`;
    csvContent += `Contest Name,${contest.title}\n`;
    csvContent += `Subject,${contest.subject || contest.category}\n`;
    csvContent += `Faculty Name,${contest.faculty || 'System Faculty'}\n`;
    csvContent += `Contest Date,${contest.date}\n`;
    csvContent += `Total Participants,${participants.length}\n`;
    csvContent += `Average Score,${analytics.avgScore.toFixed(1)}/100\n`;
    csvContent += `Highest Score,${analytics.highestScore}/100\n`;
    csvContent += `Lowest Score,${analytics.lowestScore}/100\n\n`;
    
    csvContent += `STUDENT SUMMARY TABLE\n`;
    csvContent += `Student Name,Student ID,Score,Status,Violations\n`;
    participants.forEach(p => {
      csvContent += `"${p.name}",${p.id},"${p.score}","${p.status}",${p.violations}\n`;
    });
    csvContent += `\n`;
    
    csvContent += `CONTEST ANALYTICS\n`;
    csvContent += `Total Students Participated,${analytics.totalParticipated}\n`;
    csvContent += `Total Completed,${analytics.totalCompleted}\n`;
    csvContent += `Total Terminated,${analytics.totalTerminated}\n`;
    csvContent += `Total Violations,${analytics.totalViolations}\n`;
    csvContent += `Average Marks,${analytics.avgScore.toFixed(1)}\n\n`;
    
    csvContent += `TOP PERFORMERS\n`;
    csvContent += `Rank,Student Name,Student ID,Score\n`;
    analytics.topPerformers.forEach((p, idx) => {
      csvContent += `#${idx + 1},"${p.name}",${p.id},"${p.score}"\n`;
    });
    csvContent += `\n`;
    
    csvContent += `VIOLATION SUMMARY\n`;
    if (violations.length === 0) {
      csvContent += `No proctoring violations recorded for this contest.\n`;
    } else {
      csvContent += `Student Name,Student ID,Violations,Remarks\n`;
      violations.forEach(v => {
        const remarks = v.logs.join('; ') || (v.status === 'Terminated' ? 'System terminated due to excessive proctoring violations.' : 'Minor tab focus warning issued.');
        csvContent += `"${v.name}",${v.id},${v.violations},"${remarks}"\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${contest.title.replace(/\s+/g, '_')}_Contest_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerNotification('success', 'Excel (CSV) consolidated report downloaded successfully. 📥');
  };

  const handlePrintPDF = (contest, participants, analytics, violations) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${contest.title} - Consolidated Contest Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; background-color: #ffffff; }
            .header { text-align: center; border-bottom: 3px double #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 26px; font-weight: 850; color: #1e3a8a; margin-bottom: 6px; letter-spacing: -0.03em; text-transform: uppercase; }
            .subtitle { font-size: 14px; color: #4b5563; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            .report-title { font-size: 20px; font-weight: 800; margin-top: 15px; color: #111827; }
            .section { margin-bottom: 32px; page-break-inside: avoid; }
            .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px; letter-spacing: 0.05em; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 10px; }
            .grid-item { font-size: 13px; color: #374151; }
            .grid-item strong { color: #111827; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
            th { background-color: #f9fafb; border-bottom: 2px solid #d1d5db; color: #374151; font-weight: 700; text-transform: uppercase; text-align: left; padding: 10px 14px; font-size: 11px; letter-spacing: 0.02em; }
            td { border-bottom: 1px solid #e5e7eb; padding: 10px 14px; color: #4b5563; }
            tr:nth-child(even) td { background-color: #f9fafb; }
            .badge { font-weight: 700; padding: 3px 8px; borderRadius: 4px; font-size: 11px; text-transform: uppercase; display: inline-block; }
            .badge-success { background-color: #d1fae5; color: #065f46; }
            .badge-danger { background-color: #fee2e2; color: #991b1b; }
            .badge-warning { background-color: #fef3c7; color: #92400e; }
            .text-danger { color: #dc2626; font-weight: 700; }
            .text-bold { font-weight: 700; color: #111827; }
            @media print {
              body { padding: 0; }
              @page { size: A4; margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Campus Contest Portal</div>
            <div class="subtitle">Official Examination & Assessment Report</div>
            <div class="report-title">CONSOLIDATED CONTEST REPORT</div>
          </div>
          
          <div class="section">
            <div class="section-title">Contest Information</div>
            <div class="grid">
              <div class="grid-item"><strong>Contest Name:</strong> ${contest.title}</div>
              <div class="grid-item"><strong>Subject:</strong> ${contest.subject || contest.category}</div>
              <div class="grid-item"><strong>Faculty Name:</strong> ${contest.faculty || 'System Faculty'}</div>
              <div class="grid-item"><strong>Contest Date:</strong> ${contest.date}</div>
              <div class="grid-item"><strong>Total Participants:</strong> ${participants.length}</div>
              <div class="grid-item"><strong>Average Score:</strong> ${analytics.avgScore.toFixed(1)}/100</div>
              <div class="grid-item"><strong>Highest Score:</strong> ${analytics.highestScore}/100</div>
              <div class="grid-item"><strong>Lowest Score:</strong> ${analytics.lowestScore}/100</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Student Summary Table</div>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Violations</th>
                </tr>
              </thead>
              <tbody>
                ${participants.map(p => `
                  <tr>
                    <td class="text-bold">${p.name}</td>
                    <td>${p.id}</td>
                    <td class="text-bold">${p.score}</td>
                    <td><span class="badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'Terminated' ? 'badge-danger' : 'badge-warning'}">${p.status}</span></td>
                    <td class="${p.violations > 0 ? 'text-danger' : ''}">${p.violations}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Contest Analytics</div>
            <div class="grid">
              <div class="grid-item"><strong>Total Students Participated:</strong> ${analytics.totalParticipated}</div>
              <div class="grid-item"><strong>Total Completed:</strong> ${analytics.totalCompleted}</div>
              <div class="grid-item"><strong>Total Terminated:</strong> ${analytics.totalTerminated}</div>
              <div class="grid-item"><strong>Total Violations Logged:</strong> ${analytics.totalViolations}</div>
              <div class="grid-item"><strong>Average Marks:</strong> ${analytics.avgScore.toFixed(1)}</div>
            </div>
            
            <div style="margin-top: 18px;">
              <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #111827;">Top Performers</div>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${analytics.topPerformers.map((p, idx) => `
                    <tr>
                      <td>#${idx + 1}</td>
                      <td class="text-bold">${p.name}</td>
                      <td>${p.id}</td>
                      <td class="text-bold">${p.score}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Violation Summary</div>
            ${violations.length === 0 ? `
              <p style="font-size: 12px; color: #6b7280; font-style: italic;">No proctoring violations recorded for this contest.</p>
            ` : `
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Violations</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${violations.map(v => {
                    const remarks = v.logs.join('; ') || (v.status === 'Terminated' ? 'System terminated due to excessive proctoring violations.' : 'Minor tab focus warning issued.');
                    return `
                      <tr>
                        <td class="text-bold">${v.name}</td>
                        <td>${v.id}</td>
                        <td class="text-danger">${v.violations}</td>
                        <td style="color: #b91c1c;">${remarks}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            `}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Add tiny delay to ensure stylesheet loads in printing window
    setTimeout(() => {
      printWindow.print();
    }, 250);

    triggerNotification('success', 'PDF Print Dialog opened successfully. 📃');
  };



  return (
    <div className="page-container animate-fade-in" style={{ padding: '32px 40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '850', color: 'var(--logo-title-color)', letterSpacing: '-0.02em', margin: 0 }}>
          Manage Contests
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
          Monitor published assessments, track active participants, and review proctoring/UFM violation logs.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '0px', overflow: 'hidden', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
        
        {contests.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-tertiary)', gap: '12px' }}>
            <FileText size={48} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '750', margin: 0, color: 'var(--text-primary)' }}>No Contests Available</h4>
            <p style={{ fontSize: '0.9rem', maxWidth: '360px', textAlign: 'center', margin: 0 }}>Create a contest first from the "Create Contest" panel to manage it here.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 24px' }}>Contest Name</th>
                <th style={{ padding: '16px 24px' }}>Subject</th>
                <th style={{ padding: '16px 24px' }}>Date</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px' }}>Total Marks</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const isExpanded = expandedContestId === contest.id;
                
                return (
                  <React.Fragment key={contest.id}>
                    {/* Main Row */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '18px 24px', fontWeight: '750', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{contest.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px 24px', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        {contest.subject || contest.category}
                      </td>
                      <td style={{ padding: '18px 24px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        {contest.date}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          color: contest.status === 'Completed' ? 'var(--primary)' : contest.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                          backgroundColor: contest.status === 'Completed' ? 'rgba(59, 130, 246, 0.08)' : contest.status === 'Active' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}>
                          {contest.status}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {contest.totalMarks || 100}
                      </td>
                      <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
                          <button
                            onClick={() => toggleExpandContest(contest.id)}
                            style={{
                              border: '1.5px solid var(--border-color)',
                              background: 'none',
                              color: 'var(--text-secondary)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.82rem',
                              fontWeight: '600'
                            }}
                          >
                            <span>Reports</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteContest(contest.id, contest.title)}
                            style={{
                              border: 'none',
                              background: 'var(--danger-light)',
                              color: 'var(--danger)',
                              padding: '8px',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            title="Delete Contest"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel (Sub-row) */}
                    {isExpanded && (
                      <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <td colSpan={6} style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={18} style={{ color: 'var(--primary)' }} />
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '750', color: 'var(--text-primary)' }}>
                                  Participant Summary & Proctoring ({mockParticipants.length})
                                </h4>
                              </div>
                              
                              <button
                                onClick={() => handleOpenReportModal(contest)}
                                style={{
                                  border: 'none',
                                  background: 'var(--primary)',
                                  color: '#fff',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                                }}
                              >
                                <Download size={14} />
                                <span>Download Contest Report</span>
                              </button>
                            </div>

                            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '12px 18px' }}>Student Name</th>
                                    <th style={{ padding: '12px 18px' }}>Student ID</th>
                                    <th style={{ padding: '12px 18px' }}>Status</th>
                                    <th style={{ padding: '12px 18px' }}>Score</th>
                                    <th style={{ padding: '12px 18px' }}>Violations</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mockParticipants.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                      <td style={{ padding: '12px 18px', fontWeight: '700' }}>{student.name}</td>
                                      <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>{student.id}</td>
                                      <td style={{ padding: '12px 18px' }}>
                                        <span style={{
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          color: student.status === 'Completed' ? 'var(--success)' : student.status === 'Terminated' ? 'var(--danger)' : 'var(--primary)',
                                          backgroundColor: student.status === 'Completed' ? 'var(--success-light)' : student.status === 'Terminated' ? 'var(--danger-light)' : 'var(--primary-light)',
                                          padding: '3px 8px',
                                          borderRadius: '6px',
                                          display: 'inline-block'
                                        }}>
                                          {student.status}
                                        </span>
                                      </td>
                                      <td style={{ padding: '12px 18px', fontWeight: '750' }}>{student.score}</td>
                                      <td style={{ padding: '12px 18px', color: student.violations > 0 ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: student.violations > 0 ? '700' : 'normal' }}>
                                        {student.violations}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}

      {/* Consolidated Report Modal */}
      {showReportModal && selectedContestForReport && (() => {
        const contest = selectedContestForReport;
        const analytics = getAnalytics(contest, mockParticipants);
        const violationStudents = mockParticipants.filter(p => p.violations > 0);

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fade-in 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 28px',
                borderBottom: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '750', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Consolidated Exam Report
                  </span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: '850', color: 'var(--text-primary)' }}>
                    {contest.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                
                {/* Download Actions Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: 'var(--primary-light)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Available Export Actions:
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handlePrintPDF(contest, mockParticipants, analytics, violationStudents)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.15)'
                      }}
                    >
                      <FileText size={14} />
                      <span>Download PDF Report</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownloadExcel(contest, mockParticipants, analytics, violationStudents)}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.15)'
                      }}
                    >
                      <Download size={14} />
                      <span>Download Excel Report</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Contest Information */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    1. Contest Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '0 4px' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Subject Name</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{contest.subject || contest.category}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Faculty Evaluator</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{contest.faculty || 'Dr. Anirban Sen'}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Contest Date</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{contest.date}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Total Participants</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{analytics.totalParticipated} Students</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Average Score</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{analytics.avgScore.toFixed(1)}/100</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.78rem' }}>Highest / Lowest Score</span>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '750' }}>{analytics.highestScore} / {analytics.lowestScore}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 2: Student Summary Table */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    2. Student Summary Table
                  </h4>
                  <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '8px 12px' }}>Student Name</th>
                          <th style={{ padding: '8px 12px' }}>Student ID</th>
                          <th style={{ padding: '8px 12px' }}>Score</th>
                          <th style={{ padding: '8px 12px' }}>Status</th>
                          <th style={{ padding: '8px 12px' }}>Violations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockParticipants.map((p) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                            <td style={{ padding: '8px 12px', fontWeight: '700' }}>{p.name}</td>
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{p.id}</td>
                            <td style={{ padding: '8px 12px', fontWeight: '700' }}>{p.score}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                color: p.status === 'Completed' ? 'var(--success)' : p.status === 'Terminated' ? 'var(--danger)' : 'var(--primary)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: p.status === 'Completed' ? 'var(--success-light)' : p.status === 'Terminated' ? 'var(--danger-light)' : 'var(--primary-light)'
                              }}>{p.status}</span>
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: '600', color: p.violations > 0 ? 'var(--danger)' : 'inherit' }}>{p.violations}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: Contest Analytics */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    3. Contest Analytics
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Students Participated</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '800' }}>{analytics.totalParticipated}</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Completed</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: '800' }}>{analytics.totalCompleted}</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Terminated (UFM)</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--danger)', fontWeight: '800' }}>{analytics.totalTerminated}</strong>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Total Violations</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--warning)', fontWeight: '800' }}>{analytics.totalViolations}</strong>
                    </div>
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', fontSize: '0.78rem', fontWeight: '800', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      Class Top Performers
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                      <tbody>
                        {analytics.topPerformers.map((p, idx) => (
                          <tr key={p.id} style={{ borderBottom: idx < analytics.topPerformers.length - 1 ? '1px solid var(--border-color)' : 'none', color: 'var(--text-primary)' }}>
                            <td style={{ padding: '8px 12px', width: '60px', fontWeight: '750', color: 'var(--warning)' }}>#{idx + 1}</td>
                            <td style={{ padding: '8px 12px', fontWeight: '700' }}>{p.name}</td>
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>ID: {p.id}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '750', color: 'var(--primary)' }}>{p.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 4: Violation Summary */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    4. Proctoring Violation Summary
                  </h4>
                  {violationStudents.length === 0 ? (
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                      No proctoring violations recorded for this contest.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '8px 12px' }}>Student Name</th>
                            <th style={{ padding: '8px 12px' }}>Student ID</th>
                            <th style={{ padding: '8px 12px' }}>Violations</th>
                            <th style={{ padding: '8px 12px' }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {violationStudents.map((v) => {
                            const remarks = v.logs.join('; ') || (v.status === 'Terminated' ? 'System terminated due to excessive proctoring violations.' : 'Minor tab focus warning issued.');
                            return (
                              <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                <td style={{ padding: '8px 12px', fontWeight: '700' }}>{v.name}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{v.id}</td>
                                <td style={{ padding: '8px 12px', fontWeight: '750', color: 'var(--danger)' }}>{v.violations}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--danger)' }}>{remarks}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 28px',
                borderTop: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                justifyContent: 'flex-end',
                borderRadius: '0 0 20px 20px'
              }}>
                <button
                  onClick={() => setShowReportModal(false)}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '8px 20px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      </div>
    </div>
  );
}
