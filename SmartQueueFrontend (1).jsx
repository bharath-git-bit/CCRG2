import React, { useState, useEffect } from 'react';

const QueueSystem = () => {
  const [activeView, setActiveView] = useState('customer');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [currentQueuePosition, setCurrentQueuePosition] = useState(3);
  const [queueLength, setQueueLength] = useState(12);
  const [avgWaitTime, setAvgWaitTime] = useState(18);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [allAppointments, setAllAppointments] = useState([
    { id: 1, name: 'John Smith', time: '09:00', status: 'completed', duration: 15 },
    { id: 2, name: 'Sarah Johnson', time: '09:20', status: 'in-progress', duration: 20 },
    { id: 3, name: 'Mike Davis', time: '09:45', status: 'waiting', duration: 15 },
    { id: 4, name: 'Lisa Anderson', time: '10:05', status: 'waiting', duration: 20 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentQueuePosition(prev => Math.max(0, prev - 1));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBookAppointment = () => {
    if (customerName && customerPhone) {
      setAppointmentBooked(true);
      setTimeout(() => setAppointmentBooked(false), 3000);
    }
  };

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#27500A';
      case 'in-progress': return '#185FA5';
      case 'waiting': return '#BA7517';
      default: return '#5F5E5A';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In progress';
      case 'waiting': return 'Waiting';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ padding: '2rem 0', fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif)' }}>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '0.5px solid var(--border)' }}>
        <button
          onClick={() => setActiveView('customer')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeView === 'customer' ? 'transparent' : 'transparent',
            border: 'none',
            borderBottom: activeView === 'customer' ? '2px solid var(--text-accent)' : 'none',
            color: activeView === 'customer' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeView === 'customer' ? '500' : '400',
          }}
        >
          <i className="ti ti-user" style={{ marginRight: '6px', fontSize: '18px', verticalAlign: '-3px' }} aria-hidden="true"></i>
          Customer
        </button>
        <button
          onClick={() => setActiveView('staff')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeView === 'staff' ? '2px solid var(--text-accent)' : 'none',
            color: activeView === 'staff' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeView === 'staff' ? '500' : '400',
          }}
        >
          <i className="ti ti-briefcase" style={{ marginRight: '6px', fontSize: '18px', verticalAlign: '-3px' }} aria-hidden="true"></i>
          Staff
        </button>
      </div>

      {/* Customer View */}
      {activeView === 'customer' && (
        <div>
          {/* Queue Status Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Your queue position
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
              {/* Position Card */}
              <div style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>Current position</p>
                <p style={{ fontSize: '32px', fontWeight: '500', color: 'var(--text-accent)', margin: '0' }}>
                  {currentQueuePosition === 0 ? 'Now' : `#${currentQueuePosition}`}
                </p>
              </div>
              {/* Queue Length Card */}
              <div style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>In queue</p>
                <p style={{ fontSize: '32px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                  {queueLength}
                </p>
              </div>
              {/* Wait Time Card */}
              <div style={{
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>Avg wait</p>
                <p style={{ fontSize: '32px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>
                  {avgWaitTime}m
                </p>
              </div>
            </div>

            {/* Live Queue Visualization */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-1)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1rem', fontWeight: '500' }}>Queue flow</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <React.Fragment key={i}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: i <= currentQueuePosition ? 'var(--bg-success)' : i === currentQueuePosition + 1 ? 'var(--bg-accent)' : 'var(--surface-0)',
                      border: `0.5px solid ${i === currentQueuePosition + 1 ? 'var(--border-accent)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: i <= currentQueuePosition ? 'var(--text-success)' : i === currentQueuePosition + 1 ? 'var(--text-accent)' : 'var(--text-secondary)',
                      flexShrink: 0
                    }}>
                      {i <= currentQueuePosition ? <i className="ti ti-check" style={{ fontSize: '16px' }} aria-hidden="true"></i> : i}
                    </div>
                    {i < 5 && <div style={{ flex: '1', height: '1px', background: 'var(--border)', minWidth: '8px' }}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Appointment Booking Section */}
          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Book an appointment
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Your name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Phone number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  {availableTimeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: 'var(--fill-accent)',
                color: 'var(--on-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--fill-primary)'}
              onMouseOut={(e) => e.target.style.background = 'var(--fill-accent)'}
            >
              <i className="ti ti-calendar-plus" style={{ marginRight: '6px', fontSize: '18px', verticalAlign: '-2px' }} aria-hidden="true"></i>
              Book appointment
            </button>

            {appointmentBooked && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg-success)',
                border: '0.5px solid var(--border-success)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-success)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="ti ti-check-circle" style={{ fontSize: '18px' }} aria-hidden="true"></i>
                Appointment confirmed for {selectedDate} at {selectedTime}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff View */}
      {activeView === 'staff' && (
        <div>
          {/* Dashboard Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
            <div style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>In queue</p>
              <p style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>{queueLength}</p>
            </div>
            <div style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>Avg wait time</p>
              <p style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>{avgWaitTime}m</p>
            </div>
            <div style={{
              background: 'var(--surface-1)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>Completed today</p>
              <p style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text-primary)', margin: '0' }}>14</p>
            </div>
          </div>

          {/* Queue Management */}
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <i className="ti ti-users" style={{ marginRight: '6px', fontSize: '18px', verticalAlign: '-2px' }} aria-hidden="true"></i>
            Active queue
          </h2>

          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                <div>Customer</div>
                <div>Appointment</div>
                <div>Status</div>
                <div style={{ textAlign: 'right' }}>Action</div>
              </div>
            </div>

            {allAppointments.map((appt) => (
              <div key={appt.id} style={{
                padding: '1rem',
                borderBottom: '0.5px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '12px',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {appt.name}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {appt.time} ({appt.duration}m)
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '0.375rem 0.75rem',
                  background: (() => {
                    if (appt.status === 'completed') return 'var(--bg-success)';
                    if (appt.status === 'in-progress') return 'var(--bg-accent)';
                    return 'var(--bg-warning)';
                  })(),
                  color: (() => {
                    if (appt.status === 'completed') return 'var(--text-success)';
                    if (appt.status === 'in-progress') return 'var(--text-accent)';
                    return 'var(--text-warning)';
                  })(),
                  borderRadius: 'var(--radius)',
                  width: 'fit-content'
                }}>
                  {getStatusLabel(appt.status)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {appt.status === 'waiting' && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      fontSize: '13px',
                      background: 'transparent',
                      border: '0.5px solid var(--border-accent)',
                      color: 'var(--text-accent)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      <i className="ti ti-call" style={{ marginRight: '4px', fontSize: '14px', verticalAlign: '-1px' }} aria-hidden="true"></i>
                      Call
                    </button>
                  )}
                  {appt.status === 'in-progress' && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      fontSize: '13px',
                      background: 'transparent',
                      border: '0.5px solid var(--border)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      <i className="ti ti-check" style={{ marginRight: '4px', fontSize: '14px', verticalAlign: '-1px' }} aria-hidden="true"></i>
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Quick actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <button style={{
                padding: '1rem',
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-0)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
              >
                <i className="ti ti-volume-3" style={{ fontSize: '20px', color: 'var(--text-accent)' }} aria-hidden="true"></i>
                Call next
              </button>
              <button style={{
                padding: '1rem',
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-0)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
              >
                <i className="ti ti-refresh" style={{ fontSize: '20px', color: 'var(--text-accent)' }} aria-hidden="true"></i>
                Refresh queue
              </button>
              <button style={{
                padding: '1rem',
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-0)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
              >
                <i className="ti ti-download" style={{ fontSize: '20px', color: 'var(--text-accent)' }} aria-hidden="true"></i>
                Export report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueSystem;
