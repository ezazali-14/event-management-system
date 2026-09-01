import React, { useState, useEffect } from 'react';
import {
  initialOrganizers,
  initialEvents,
  initialAttendeePasses,
  initialRosterData,
  initialVolunteers,
  initialPayouts,
  defaultAttendeeProfile,
  pastCompletedEvents
} from './mockData';
import {
  Calendar, MapPin, Ticket, PlusCircle, CheckCircle2,
  Search, Trash2, Users, ShieldCheck, UserCheck, ArrowUpRight,
  X, CheckSquare, CreditCard, Smartphone, Building, LogOut,
  Lock, Mail, Receipt, HelpCircle, User, Award, Info,
  FileText, Download, Clock, DollarSign, ChevronDown, ChevronUp,
  Send, Edit3, Megaphone, Filter, TrendingUp, AlertCircle, Phone, Globe,
  QrCode, Maximize2, ShieldAlert, Layers, Percent, Check, FileSpreadsheet,
  UserPlus, UserCheck2, BadgeCheck, ExternalLink, Eye, RefreshCw
} from 'lucide-react';

export default function App() {
  // --- Persistent Storage State ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eh_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('eh_events_list');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [myPasses, setMyPasses] = useState(() => {
    const saved = localStorage.getItem('eh_user_passes');
    return saved ? JSON.parse(saved) : initialAttendeePasses;
  });

  const [roster, setRoster] = useState(() => {
    const saved = localStorage.getItem('eh_roster_data');
    return saved ? JSON.parse(saved) : initialRosterData;
  });

  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('eh_volunteers');
    return saved ? JSON.parse(saved) : initialVolunteers;
  });

  const [payouts, setPayouts] = useState(() => {
    const saved = localStorage.getItem('eh_payouts');
    return saved ? JSON.parse(saved) : initialPayouts;
  });

  const [issuedCertificates, setIssuedCertificates] = useState(() => {
    const saved = localStorage.getItem('eh_issued_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('eh_user_transactions');
    return saved ? JSON.parse(saved) : [
      { txnId: 'TXN-98471203', eventTitle: 'National AI & Edge Compute Hackathon 2026', amount: 0, method: 'Free Instant Pass', date: '2026-08-20', status: 'Success' },
      { txnId: 'TXN-33910294', eventTitle: 'Annual Campus Rock Fest & Battle of Bands', amount: 250, method: 'UPI (GPay)', date: '2026-08-22', status: 'Success' }
    ];
  });

  const [attendeeProfile, setAttendeeProfile] = useState(() => {
    const saved = localStorage.getItem('eh_user_profile');
    return saved ? JSON.parse(saved) : (defaultAttendeeProfile || {
      name: 'Thuregal Mohammed Ezaz Ali',
      email: 'attendee@eventhub.com',
      phone: '+91 98765 00112',
      institution: 'CMR College of Engineering & Technology',
      department: 'Data Science & IoT Systems',
      studentId: 'CMRCET-DS-2026-084'
    });
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('eh_announcements');
    return saved ? JSON.parse(saved) : [
      { id: 'ann-1', organizerId: 'org_tech', organizerName: 'Tech & Innovation Society', text: 'AI Hackathon Round 1 problem statements will be unlocked 30 minutes prior to start time!', time: 'Today, 08:30 AM' }
    ];
  });

  // --- UI Navigation State ---
  const [activeTab, setActiveTab] = useState('browse'); // Attendee: 'browse'|'my-tickets'|'transactions'|'profile'|'about'|'help' -- Organizer: 'dashboard'|'scanner'|'revenue'|'staff'|'certificates'|'announcements'|'org-profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');

  // --- Auth State ---
  const [authRoleTab, setAuthRoleTab] = useState('attendee');
  const [emailInput, setEmailInput] = useState('attendee@eventhub.com');
  const [passwordInput, setPasswordInput] = useState('user123');
  const [selectedOrganizerId, setSelectedOrganizerId] = useState('org_tech');

  // --- Attendee Checkout State ---
  const [checkoutEvent, setCheckoutEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('ezaz@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Organizer Modal Controls ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEventModal, setEditEventModal] = useState(null);

  // Host Event Wizard Ticket Tiers Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathons & Tech',
    date: '',
    time: '',
    location: '',
    price: 0,
    totalTickets: 100,
    description: '',
    ticketTiers: [
      { id: 't1', name: 'General Student Pass', price: 0, capacity: 70 },
      { id: 't2', name: 'VIP Access Pass', price: 149, capacity: 30 }
    ]
  });

  // --- Feature 1: Gate Scanner State ---
  const [scannerSelectedEventId, setScannerSelectedEventId] = useState('evt-tech-01');
  const [scannerPassIdInput, setScannerPassIdInput] = useState('');
  const [scannerScanResult, setScannerScanResult] = useState(null); // { status: 'success'|'duplicate'|'invalid', message: '', attendee: null, timestamp: '' }

  // --- Feature 2: Bank Settlement State ---
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutBankName, setPayoutBankName] = useState('HDFC Bank');
  const [payoutAccountNo, setPayoutAccountNo] = useState('•••• 8821');

  // --- Feature 3: Staff & Volunteer Delegation State ---
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Gate Volunteer',
    eventId: 'evt-tech-01'
  });

  // --- Feature 4: Certificate Issuer State ---
  const [certSelectedEventId, setCertSelectedEventId] = useState('evt-tech-01');
  const [previewCertModal, setPreviewCertModal] = useState(null); // certificate obj

  // --- Feature 5: Bulk Email Dispatcher State ---
  const [broadcastTargetEventId, setBroadcastTargetEventId] = useState('evt-tech-01');
  const [broadcastSubject, setBroadcastSubject] = useState('Urgent: Venue Guidelines & Discord Link');
  const [broadcastMessage, setBroadcastMessage] = useState('Dear Registrants,\n\nPlease make sure to bring your college ID card and laptops with Docker installed. Check-in starts at 08:30 AM in the Main Auditorium.');

  // --- Roster Modal Controls ---
  const [viewRosterEvent, setViewRosterEvent] = useState(null);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterFilter, setRosterFilter] = useState('all');

  // Toasts
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eh_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eh_session_user');
    }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('eh_events_list', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('eh_user_passes', JSON.stringify(myPasses)); }, [myPasses]);
  useEffect(() => { localStorage.setItem('eh_roster_data', JSON.stringify(roster)); }, [roster]);
  useEffect(() => { localStorage.setItem('eh_volunteers', JSON.stringify(volunteers)); }, [volunteers]);
  useEffect(() => { localStorage.setItem('eh_payouts', JSON.stringify(payouts)); }, [payouts]);
  useEffect(() => { localStorage.setItem('eh_issued_certificates', JSON.stringify(issuedCertificates)); }, [issuedCertificates]);
  useEffect(() => { localStorage.setItem('eh_user_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('eh_user_profile', JSON.stringify(attendeeProfile)); }, [attendeeProfile]);
  useEffect(() => { localStorage.setItem('eh_announcements', JSON.stringify(announcements)); }, [announcements]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Auth Handlers ---
  const handleAttendeeLogin = (e) => {
    e.preventDefault();
    setCurrentUser({
      role: 'attendee',
      id: 'user_1',
      name: attendeeProfile.name,
      email: emailInput || attendeeProfile.email
    });
    setActiveTab('browse');
    showToast('Signed in as Attendee');
  };

  const handleOrganizerLogin = (e) => {
    e.preventDefault();
    const org = initialOrganizers.find(o => o.id === selectedOrganizerId) || initialOrganizers[0];
    setCurrentUser({
      role: 'organizer',
      id: org.id,
      name: org.name,
      email: org.email,
      dept: org.department,
      lead: org.lead,
      contact: org.contact,
      bio: org.bio
    });
    setActiveTab('dashboard');
    showToast(`Signed in as ${org.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out');
  };

  // --- Feature 1: Gate Scanner Verification ---
  const handleVerifyPass = (e) => {
    if (e) e.preventDefault();
    const cleanId = scannerPassIdInput.trim().toUpperCase();
    if (!cleanId) return;

    const match = roster.find(r => r.bookingId === cleanId && r.eventId === scannerSelectedEventId);

    if (!match) {
      setScannerScanResult({
        status: 'invalid',
        message: `Invalid Pass ID "${cleanId}". Ticket reference code not found for this event roster.`,
        attendee: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      return;
    }

    if (match.checkedIn) {
      setScannerScanResult({
        status: 'duplicate',
        message: `Already Admitted at ${match.checkInTime || 'Earlier'}. Ticket pass has already been scanned.`,
        attendee: match,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      return;
    }

    // Mark as Checked-In
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedRoster = roster.map(r => r.bookingId === cleanId ? { ...r, checkedIn: true, checkInTime: nowTime } : r);
    const updatedPasses = myPasses.map(p => p.bookingId === cleanId ? { ...p, checkedIn: true, checkInTime: nowTime } : p);

    setRoster(updatedRoster);
    setMyPasses(updatedPasses);

    setScannerScanResult({
      status: 'success',
      message: `Valid Pass Code Verified! ${match.attendeeName} (${match.attendeeEmail}) admitted successfully.`,
      attendee: { ...match, checkedIn: true, checkInTime: nowTime },
      timestamp: nowTime
    });

    setScannerPassIdInput('');
    showToast(`Admitted ${match.attendeeName}`);
  };

  // --- Feature 2: Bank Settlement Request ---
  const handleConfirmPayout = (e) => {
    e.preventDefault();
    const myEvents = events.filter(ev => ev.organizerId === currentUser.id);
    const grossRevenue = myEvents.reduce((sum, ev) => sum + (ev.soldTickets * ev.price), 0);
    const deductions = Math.round(grossRevenue * 0.18);
    const pastPayoutsSum = payouts.filter(p => p.organizerId === currentUser.id).reduce((sum, p) => sum + p.amount, 0);
    const netBalance = Math.max(0, grossRevenue - deductions - pastPayoutsSum);

    if (netBalance <= 0) {
      showToast('No pending disbursable balance available for payout.');
      setIsPayoutModalOpen(false);
      return;
    }

    const newPayout = {
      id: 'PAYOUT-' + Math.floor(1000000 + Math.random() * 9000000),
      organizerId: currentUser.id,
      amount: netBalance,
      bankName: payoutBankName,
      accountNo: payoutAccountNo,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      refNo: 'UTR-' + payoutBankName.slice(0, 4).toUpperCase() + '-' + Math.floor(10000000 + Math.random() * 90000000)
    };

    setPayouts([newPayout, ...payouts]);
    setIsPayoutModalOpen(false);
    showToast(`Payout of ₹${netBalance.toLocaleString()} transferred to ${payoutBankName}!`);
  };

  const handleDownloadAuditCSV = () => {
    const myEvents = events.filter(ev => ev.organizerId === currentUser.id);
    const grossRevenue = myEvents.reduce((sum, ev) => sum + (ev.soldTickets * ev.price), 0);
    const deductions = Math.round(grossRevenue * 0.18);
    const pastPayouts = payouts.filter(p => p.organizerId === currentUser.id);

    const headers = ['Report Category', 'Details', 'Amount (INR)'];
    const rows = [
      ['Gross Ticket Revenue', `${myEvents.length} Owned Events`, grossRevenue],
      ['GST & Platform Deduction (18%)', 'Tax & Infrastructure', deductions],
      ['Net Disbursable Income', 'Post-tax Revenue', grossRevenue - deductions],
      ...pastPayouts.map(p => ['Completed Bank Payout', `${p.bankName} (${p.accountNo}) - Ref: ${p.refNo}`, p.amount])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Audit_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial Audit CSV Statement downloaded');
  };

  // --- Feature 3: Volunteer Delegation ---
  const handleAddStaffMember = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    const eventObj = events.find(ev => ev.id === newStaff.eventId);
    const created = {
      id: 'vol-' + Date.now(),
      organizerId: currentUser.id,
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      role: newStaff.role,
      eventId: newStaff.eventId,
      eventTitle: eventObj ? eventObj.title : 'All Events',
      status: 'Active',
      assignedDate: new Date().toISOString().split('T')[0]
    };

    setVolunteers([created, ...volunteers]);
    setIsAddStaffModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'Gate Volunteer', eventId: events[0]?.id || '' });
    showToast(`Assigned ${created.name} as ${created.role}`);
  };

  const handleRemoveStaff = (id) => {
    if (window.confirm('Revoke access for this committee member?')) {
      setVolunteers(volunteers.filter(v => v.id !== id));
      showToast('Staff access revoked');
    }
  };

  // --- Feature 4: Certificate Generation ---
  const handleGenerateCertificates = (eventId) => {
    const eventObj = events.find(ev => ev.id === eventId);
    if (!eventObj) return;

    const checkedInAttendees = roster.filter(r => r.eventId === eventId && r.checkedIn);
    if (checkedInAttendees.length === 0) {
      showToast('No checked-in attendees found for this event.');
      return;
    }

    const newCerts = checkedInAttendees.map(att => ({
      certificateId: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
      eventId,
      eventTitle: eventObj.title,
      organizerName: currentUser.name,
      organizerLead: currentUser.lead || 'Organizing Lead',
      studentName: att.attendeeName,
      studentEmail: att.attendeeEmail,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: eventObj.location,
      hash: 'HASH-0x' + Math.floor(10000000 + Math.random() * 90000000).toString(16)
    }));

    setIssuedCertificates([...newCerts, ...issuedCertificates]);
    showToast(`Generated & dispatched ${newCerts.length} verified digital certificates!`);
  };

  // --- Feature 5: Bulk Email Dispatcher ---
  const handleDispatchBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;

    const eventObj = events.find(ev => ev.id === broadcastTargetEventId);
    const targetCount = roster.filter(r => r.eventId === broadcastTargetEventId).length;

    const newAnn = {
      id: 'ann-' + Date.now(),
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      eventTitle: eventObj ? eventObj.title : 'General Update',
      subject: broadcastSubject,
      text: broadcastMessage,
      targetCount,
      time: 'Just now'
    };

    setAnnouncements([newAnn, ...announcements]);
    showToast(`Broadcast emailed to ${targetCount} registered attendees!`);
    setBroadcastSubject('');
    setBroadcastMessage('');
  };

  // --- Attendee Checkout ---
  const handleInitiateBooking = (evt) => {
    const defaultTier = evt.ticketTiers && evt.ticketTiers.length > 0 ? evt.ticketTiers[0] : { name: 'General Pass', price: evt.price };
    setSelectedTier(defaultTier);
    setCheckoutEvent(evt);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!checkoutEvent) return;

    setIsProcessing(true);
    setTimeout(() => {
      const ticketId = 'PASS-' + Math.floor(100000 + Math.random() * 900000);
      const txnId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
      const tierPrice = selectedTier ? selectedTier.price : checkoutEvent.price;
      const chosenMethod = tierPrice === 0 ? 'Free Instant Pass' : (paymentMethod === 'upi' ? `UPI (${upiId})` : 'Credit Card (•••• 4444)');

      const newPass = {
        bookingId: ticketId,
        eventId: checkoutEvent.id,
        eventTitle: checkoutEvent.title,
        organizerId: checkoutEvent.organizerId,
        attendeeName: currentUser.name,
        attendeeEmail: currentUser.email,
        tierName: selectedTier ? selectedTier.name : 'Standard Pass',
        pricePaid: tierPrice,
        paymentMethod: chosenMethod,
        bookingDate: new Date().toISOString().split('T')[0],
        date: checkoutEvent.date,
        time: checkoutEvent.time,
        location: checkoutEvent.location,
        checkedIn: false
      };

      const newTxn = {
        txnId,
        eventTitle: checkoutEvent.title,
        amount: tierPrice,
        method: chosenMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'Success'
      };

      setMyPasses([newPass, ...myPasses]);
      setRoster([newPass, ...roster]);
      setTransactions([newTxn, ...transactions]);
      setEvents(events.map(ev => ev.id === checkoutEvent.id ? { ...ev, soldTickets: ev.soldTickets + 1 } : ev));

      setIsProcessing(false);
      setCheckoutEvent(null);
      showToast(`Pass Reserved! Reference: ${ticketId}`);
    }, 1000);
  };

  // --- Feature 6: Host New Event with Multi-Tier Tickets ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location) return;

    const created = {
      ...newEvent,
      id: 'evt-' + Date.now(),
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      soldTickets: 0,
      ticketTiers: newEvent.ticketTiers
    };

    setEvents([created, ...events]);
    setIsCreateModalOpen(false);
    setNewEvent({
      title: '', category: 'Hackathons & Tech', date: '', time: '', location: '', price: 0, totalTickets: 100, description: '',
      ticketTiers: [
        { id: 't1', name: 'General Pass', price: 0, capacity: 70 },
        { id: 't2', name: 'VIP Access Pass', price: 149, capacity: 30 }
      ]
    });
    showToast('New event with ticket tiers published successfully!');
  };

  // Filtered Lists
  const attendeeFilteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesPrice = priceFilter === 'all' || (priceFilter === 'free' ? evt.price === 0 : evt.price > 0);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const myOrganizerEvents = currentUser?.role === 'organizer' ? events.filter(e => e.organizerId === currentUser.id) : [];
  const myTotalRegistrations = myOrganizerEvents.reduce((sum, e) => sum + e.soldTickets, 0);
  const myTotalRevenue = myOrganizerEvents.reduce((sum, e) => sum + (e.soldTickets * e.price), 0);
  const myTotalCapacity = myOrganizerEvents.reduce((sum, e) => sum + e.totalTickets, 0);
  const myAvgOccupancy = myTotalCapacity > 0 ? Math.round((myTotalRegistrations / myTotalCapacity) * 100) : 0;
  const myDeductions = Math.round(myTotalRevenue * 0.18);
  const myPastPayoutsSum = payouts.filter(p => p.organizerId === currentUser?.id).reduce((sum, p) => sum + p.amount, 0);
  const myNetDisbursable = Math.max(0, myTotalRevenue - myDeductions - myPastPayoutsSum);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 0: AUTH GATEWAY */}
      {/* ========================================================= */}
      {!currentUser ? (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md mb-2">
                EH
              </div>
              <h1 className="text-2xl font-bold text-slate-900">EventHub Portal</h1>
              <p className="text-slate-500 text-xs mt-1">Multi-Tenant Campus & Professional Event Platform</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => { setAuthRoleTab('attendee'); setEmailInput('attendee@eventhub.com'); setPasswordInput('user123'); }}
                  className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${authRoleTab === 'attendee' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Attendee Portal</span>
                </button>
                <button
                  onClick={() => { setAuthRoleTab('organizer'); setPasswordInput('org123'); }}
                  className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${authRoleTab === 'organizer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Organizer Portal</span>
                </button>
              </div>

              {authRoleTab === 'attendee' ? (
                <form onSubmit={handleAttendeeLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attendee Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-800">
                    <strong>Demo Account:</strong> attendee@eventhub.com / pass: user123
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-sm"
                  >
                    Sign In as Attendee →
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOrganizerLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Organizing Council</label>
                    <select
                      value={selectedOrganizerId}
                      onChange={(e) => setSelectedOrganizerId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {initialOrganizers.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Admin Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                    <strong>Multi-Tenant Workspace:</strong> Access isolated analytics, CSV exports, live broadcasts, and check-in controls.
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition shadow-sm"
                  >
                    Access Organizer Console →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* TOP NAVBAR */}
          {/* ========================================================= */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  EH
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900 leading-none block">EventHub</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {currentUser.role === 'organizer' ? 'Organizer Admin Console' : 'Attendee Portal'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentUser.role === 'attendee' ? (
                  <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <button onClick={() => setActiveTab('browse')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Explore</button>
                    <button onClick={() => setActiveTab('my-tickets')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'my-tickets' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>My Passes ({myPasses.length})</button>
                    <button onClick={() => setActiveTab('transactions')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'transactions' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Transactions</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Profile</button>
                    <button onClick={() => setActiveTab('about')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'about' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>About</button>
                    <button onClick={() => setActiveTab('help')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'help' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Help</button>
                  </div>
                ) : (
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Events & Analytics</button>
                    <button onClick={() => setActiveTab('scanner')} className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${activeTab === 'scanner' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Gate Scanner</span>
                    </button>
                    <button onClick={() => setActiveTab('revenue')} className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${activeTab === 'revenue' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Payouts</span>
                    </button>
                    <button onClick={() => setActiveTab('staff')} className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${activeTab === 'staff' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Volunteers</span>
                    </button>
                    <button onClick={() => setActiveTab('certificates')} className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${activeTab === 'certificates' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificates</span>
                    </button>
                    <button onClick={() => setActiveTab('announcements')} className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${activeTab === 'announcements' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Broadcasts</span>
                    </button>
                    <button onClick={() => setActiveTab('org-profile')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTab === 'org-profile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>Org Info</button>
                  </div>
                )}

                <div className="h-5 w-px bg-slate-200 mx-1" />

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px] hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* ========================================================= */}
          {/* ORGANIZER PORTAL */}
          {/* ========================================================= */}
          {currentUser.role === 'organizer' && (
            <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
              
              {/* Header Badge */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                      Scoped Workspace
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{currentUser.dept} • Chair: {currentUser.lead}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Host New Event</span>
                  </button>
                </div>
              </div>

              {/* 1. DASHBOARD & EVENTS TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Scoped Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Live Listings</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">{myOrganizerEvents.length}</span>
                    </div>
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">{myTotalRegistrations}</span>
                    </div>
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gross Sales</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">₹{myTotalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Occupancy</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">{myAvgOccupancy}%</span>
                    </div>
                  </div>

                  {/* Scoped Events Directory */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-900">Owned Event Directory</h3>
                      <span className="text-xs text-slate-500 font-medium">{myOrganizerEvents.length} listings</span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {myOrganizerEvents.map(evt => (
                        <div key={evt.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 text-sm">{evt.title}</span>
                              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-semibold">
                                {evt.category}
                              </span>
                            </div>
                            <div className="text-slate-500 mt-1 space-x-3">
                              <span>📅 {evt.date} at {evt.time}</span>
                              <span>📍 {evt.location}</span>
                              <span>💰 {evt.price === 0 ? 'Free' : `₹${evt.price}`}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right mr-2">
                              <span className="font-bold text-slate-900 block">{evt.soldTickets} / {evt.totalTickets}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Occupancy</span>
                            </div>
                            <button
                              onClick={() => setViewRosterEvent(evt)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center space-x-1"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Roster</span>
                            </button>
                            <button
                              onClick={() => handleExportCSV(evt)}
                              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center space-x-1"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                              <span>CSV</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. GATE SCANNER TAB (FEATURE 1) */}
              {activeTab === 'scanner' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                          <QrCode className="w-5 h-5 text-blue-600" />
                          <span>Live Gate Entry QR & Pass Scanner</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Simulate entrance gate ticket verification for security volunteers</p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 mr-2">Target Event:</label>
                        <select
                          value={scannerSelectedEventId}
                          onChange={(e) => setScannerSelectedEventId(e.target.value)}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                        >
                          {myOrganizerEvents.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Viewfinder simulation */}
                      <div className="bg-slate-950 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[260px] border border-slate-800">
                        <div className="w-36 h-36 border-2 border-dashed border-blue-400/70 rounded-2xl flex items-center justify-center relative bg-slate-900/50">
                          <div className="w-full h-0.5 bg-blue-500 animate-pulse absolute top-1/2 left-0 shadow-[0_0_8px_#3b82f6]" />
                          <QrCode className="w-16 h-16 text-slate-700 opacity-40" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-4 block flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Live Scanner Active
                        </span>
                      </div>

                      {/* Manual Verification Form */}
                      <div className="space-y-4 text-xs font-semibold">
                        <form onSubmit={handleVerifyPass} className="space-y-3">
                          <label className="block text-slate-700 font-bold">Manual Pass ID Quick-Scan *</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="e.g. PASS-842910"
                              value={scannerPassIdInput}
                              onChange={(e) => setScannerPassIdInput(e.target.value)}
                              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs font-mono font-bold"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                            >
                              Verify & Admit
                            </button>
                          </div>
                        </form>

                        {/* Interactive Test Pass Chips */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Quick Test Pass IDs:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['PASS-842910', 'PASS-842911', 'PASS-913401', 'PASS-772101'].map(id => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setScannerPassIdInput(id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-mono font-bold transition border border-slate-200"
                              >
                                {id}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Scanner Result Card */}
                        {scannerScanResult && (
                          <div className={`p-4 rounded-xl border text-xs font-semibold animate-fade-in ${
                            scannerScanResult.status === 'success'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : scannerScanResult.status === 'duplicate'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}>
                            <div className="flex items-start space-x-2">
                              {scannerScanResult.status === 'success' ? (
                                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                              ) : scannerScanResult.status === 'duplicate' ? (
                                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                              )}
                              <div className="flex-1">
                                <span className="font-bold block text-sm">{scannerScanResult.message}</span>
                                {scannerScanResult.attendee && (
                                  <div className="mt-2 text-[11px] space-y-0.5 text-slate-700">
                                    <div>Pass ID: <strong className="font-mono">{scannerScanResult.attendee.bookingId}</strong></div>
                                    <div>Tier: {scannerScanResult.attendee.tierName || 'Standard Pass'}</div>
                                    <div>Payment: {scannerScanResult.attendee.paymentMethod}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. REVENUE & PAYOUTS TAB (FEATURE 2) */}
              {activeTab === 'revenue' && (
                <div className="space-y-6">
                  {/* Financial Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gross Ticket Sales</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">₹{myTotalRevenue.toLocaleString()}</span>
                    </div>

                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">GST & Platform Fees (18%)</span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">₹{myDeductions.toLocaleString()}</span>
                    </div>

                    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Net Disbursable Balance</span>
                      <span className="text-2xl font-bold text-emerald-950 mt-1 block">₹{myNetDisbursable.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions & Payout Log */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Bank Settlement & Audit Log</h3>
                        <p className="text-xs text-slate-500">Request revenue disbursements directly to registered society bank accounts</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={handleDownloadAuditCSV}
                          className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          <span>Financial Audit CSV</span>
                        </button>
                        <button
                          onClick={() => setIsPayoutModalOpen(true)}
                          disabled={myNetDisbursable <= 0}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                        >
                          Request Bank Settlement →
                        </button>
                      </div>
                    </div>

                    {/* Payout History Table */}
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Payout Ref</th>
                            <th className="p-3">Bank Account</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Amount Paid</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {payouts.filter(p => p.organizerId === currentUser.id).map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                              <td className="p-3 text-slate-700">{p.bankName} ({p.accountNo})</td>
                              <td className="p-3 text-slate-500">{p.date}</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">Transferred</span></td>
                              <td className="p-3 text-right font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. STAFF & VOLUNTEERS TAB (FEATURE 3) */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Committee Staff & Volunteer Access Delegation</h3>
                        <p className="text-xs text-slate-500">Assign role permissions to student volunteers and coordinators</p>
                      </div>

                      <button
                        onClick={() => setIsAddStaffModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add New Staff</span>
                      </button>
                    </div>

                    {/* Staff Table */}
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Staff Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Assigned Role</th>
                            <th className="p-3">Assigned Event</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {volunteers.filter(v => v.organizerId === currentUser.id).map(v => (
                            <tr key={v.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{v.name}</td>
                              <td className="p-3 text-slate-500">{v.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  v.role === 'Gate Volunteer' ? 'bg-emerald-100 text-emerald-800' :
                                  v.role === 'Coordinator' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {v.role}
                                </span>
                              </td>
                              <td className="p-3 text-slate-700 truncate max-w-[200px]">{v.eventTitle}</td>
                              <td className="p-3 text-right">
                                <button onClick={() => handleRemoveStaff(v.id)} className="text-rose-600 hover:text-rose-800 font-bold">Revoke</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CERTIFICATES TAB (FEATURE 4) */}
              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Automated Certificate Issuer</h3>
                        <p className="text-xs text-slate-500">Generate & dispatch verified digital certificates to checked-in attendees</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={certSelectedEventId}
                          onChange={(e) => setCertSelectedEventId(e.target.value)}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                        >
                          {myOrganizerEvents.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleGenerateCertificates(certSelectedEventId)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                          Generate & Dispatch Digital Certificates
                        </button>
                      </div>
                    </div>

                    {/* Checked-In Roster for Certs */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">Verified Checked-In Attendees:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                        {roster.filter(r => r.eventId === certSelectedEventId && r.checkedIn).map(att => (
                          <div key={att.bookingId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                            <div>
                              <span className="font-bold text-slate-900 block">{att.attendeeName}</span>
                              <span className="text-[11px] text-slate-500">{att.attendeeEmail} • Checked-in</span>
                            </div>
                            <button
                              onClick={() => setPreviewCertModal({
                                certificateId: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
                                eventTitle: att.eventTitle,
                                organizerName: currentUser.name,
                                organizerLead: currentUser.lead,
                                studentName: att.attendeeName,
                                issueDate: new Date().toLocaleDateString(),
                                hash: 'HASH-0x89A12491'
                              })}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Preview</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. BROADCASTS & BULK EMAIL TAB (FEATURE 5) */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 mb-4">Bulk Email Update Dispatcher</h3>

                    <form onSubmit={handleDispatchBroadcast} className="space-y-4 text-xs font-semibold">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 mb-1">Target Event</label>
                          <select
                            value={broadcastTargetEventId}
                            onChange={(e) => setBroadcastTargetEventId(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          >
                            {myOrganizerEvents.map(ev => (
                              <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-700 mb-1">Email Subject Line *</label>
                          <input
                            type="text"
                            required
                            value={broadcastSubject}
                            onChange={(e) => setBroadcastSubject(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">Broadcast Message Body *</label>
                        <textarea
                          rows="4"
                          required
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white font-medium"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                          Targeting {roster.filter(r => r.eventId === broadcastTargetEventId).length} Registered Attendees
                        </span>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                        >
                          Dispatch Bulk Email Update →
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ORG PROFILE TAB */}
              {activeTab === 'org-profile' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs font-semibold">
                  <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Organization Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block">Council Name</span>
                      <span className="text-slate-900 font-bold text-sm">{currentUser.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Department</span>
                      <span className="text-slate-900 font-bold">{currentUser.dept}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Chairperson / Lead</span>
                      <span className="text-slate-900 font-bold">{currentUser.lead}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Contact Phone</span>
                      <span className="text-slate-900 font-bold">{currentUser.contact}</span>
                    </div>
                  </div>
                </div>
              )}

            </main>
          )}

          {/* ========================================================= */}
          {/* ATTENDEE PORTAL */}
          {/* ========================================================= */}
          {currentUser.role === 'attendee' && (
            <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
              {activeTab === 'browse' && (
                <div className="space-y-6">
                  {/* Hero Filter */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900">Explore Events</h1>
                        <p className="text-xs text-slate-500">Discover hackathons, battles of bands, workshops, and LAN arenas.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search title, venue, host..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendeeFilteredEvents.map(evt => {
                      const isBooked = myPasses.some(p => p.eventId === evt.id);
                      return (
                        <div key={evt.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                              Hosted by {evt.organizerName}
                            </span>
                            <h3 className="font-bold text-slate-900 text-base leading-snug">{evt.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{evt.description}</p>
                            
                            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                              <div>📅 {evt.date} at {evt.time}</div>
                              <div>📍 {evt.location}</div>
                            </div>
                          </div>

                          <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-900">{evt.price === 0 ? 'Free Entry' : `₹${evt.price}`}</span>
                            <button
                              onClick={() => handleInitiateBooking(evt)}
                              disabled={isBooked}
                              className={`px-4 py-2 rounded-xl font-bold transition ${isBooked ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'}`}
                            >
                              {isBooked ? 'Pass Reserved ✓' : 'Get Pass →'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ATTENDEE: MY PASSES TAB */}
              {activeTab === 'my-tickets' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">My Entry Passes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myPasses.map(pass => (
                      <div key={pass.bookingId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs border-l-4 border-l-blue-600 space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{pass.bookingId}</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${pass.checkedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {pass.checkedIn ? 'Checked-In' : 'Pass Active'}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base">{pass.eventTitle}</h3>
                        <div className="text-slate-500 space-y-1">
                          <div>📅 {pass.date} at {pass.time}</div>
                          <div>📍 {pass.location}</div>
                          <div>Tier: {pass.tierName || 'Standard Pass'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATTENDEE: TRANSACTIONS TAB */}
              {activeTab === 'transactions' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs font-semibold">
                  <h2 className="text-base font-bold text-slate-900">Payment Transactions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Txn ID</th>
                          <th className="p-3">Event</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.map(t => (
                          <tr key={t.txnId}>
                            <td className="p-3 font-mono font-bold">{t.txnId}</td>
                            <td className="p-3 text-slate-900">{t.eventTitle}</td>
                            <td className="p-3 text-slate-500">{t.method}</td>
                            <td className="p-3 text-slate-500">{t.date}</td>
                            <td className="p-3 text-right font-bold">₹{t.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ATTENDEE: PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs font-semibold max-w-lg mx-auto">
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">My Attendee Profile</h2>
                  <div>
                    <label className="block text-slate-500 mb-1">Full Name</label>
                    <input type="text" value={attendeeProfile.name} onChange={(e) => setAttendeeProfile({ ...attendeeProfile, name: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Institution</label>
                    <input type="text" value={attendeeProfile.institution} onChange={(e) => setAttendeeProfile({ ...attendeeProfile, institution: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Department</label>
                    <input type="text" value={attendeeProfile.department} onChange={(e) => setAttendeeProfile({ ...attendeeProfile, department: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <button onClick={() => showToast('Profile updated!')} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save Profile Changes</button>
                </div>
              )}

              {/* ATTENDEE: ABOUT & HELP TABS */}
              {activeTab === 'about' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-xs leading-relaxed text-slate-600 font-medium max-w-2xl mx-auto">
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">About EventHub</h2>
                  <p>EventHub is an end-to-end multi-tenant platform for campus societies and professional organizers.</p>
                </div>
              )}
            </main>
          )}

          {/* ========================================================= */}
          {/* MODALS */}
          {/* ========================================================= */}

          {/* HOST NEW EVENT MODAL WITH MULTI-TIER TICKETS (FEATURE 6) */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs font-semibold max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Host New Event Wizard</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Event Title *</label>
                    <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1">Category</label>
                      <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <option value="Hackathons & Tech">Hackathons & Tech</option>
                        <option value="Workshops & Bootcamps">Workshops & Bootcamps</option>
                        <option value="Cultural & Music">Cultural & Music</option>
                        <option value="Sports & Esports">Sports & Esports</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Date</label>
                      <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1">Time</label>
                      <input type="text" required placeholder="10:00 AM" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Venue Location</label>
                      <input type="text" required placeholder="Main Auditorium" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  {/* Multi-Tier Ticket Configuration */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="block font-bold text-slate-800">Multi-Tier Ticket Definitions</span>
                    {newEvent.ticketTiers.map((t, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <input type="text" value={t.name} onChange={(e) => {
                          const updated = [...newEvent.ticketTiers];
                          updated[idx].name = e.target.value;
                          setNewEvent({ ...newEvent, ticketTiers: updated });
                        }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs" />
                        <input type="number" value={t.price} placeholder="Price ₹" onChange={(e) => {
                          const updated = [...newEvent.ticketTiers];
                          updated[idx].price = Number(e.target.value);
                          setNewEvent({ ...newEvent, ticketTiers: updated, price: updated[0].price });
                        }} className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-xs" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-600 font-bold">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">Publish Listing</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* BANK SETTLEMENT MODAL (FEATURE 2) */}
          {isPayoutModalOpen && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Bank Payout Settlement</h3>
                  <button onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleConfirmPayout} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Disbursable Amount (Net)</label>
                    <input type="text" readOnly value={`₹${myNetDisbursable.toLocaleString()}`} className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-900" />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Select Bank Account</label>
                    <select value={payoutBankName} onChange={(e) => setPayoutBankName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                      <option value="HDFC Bank">HDFC Bank (•••• 8821)</option>
                      <option value="State Bank of India (SBI)">State Bank of India (•••• 4410)</option>
                      <option value="ICICI Bank">ICICI Bank (•••• 9920)</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition">
                    Confirm Bank Payout Transfer →
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ADD STAFF MODAL (FEATURE 3) */}
          {isAddStaffModalOpen && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Assign Committee Staff</h3>
                  <button onClick={() => setIsAddStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleAddStaffMember} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Volunteer Name *</label>
                    <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Email Address *</label>
                    <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Role Permission</label>
                    <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                      <option value="Gate Volunteer">Gate Volunteer (Check-in Scanner)</option>
                      <option value="Coordinator">Coordinator (Schedules & Broadcasts)</option>
                      <option value="Finance Lead">Finance Lead (Sales & Payout Metrics)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition">
                    Delegate Role Access
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* CERTIFICATE PREVIEW MODAL (FEATURE 4) */}
          {previewCertModal && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border-4 border-slate-900 max-w-lg w-full p-8 shadow-2xl space-y-6 text-center relative font-serif">
                <button onClick={() => setPreviewCertModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-sans"><X className="w-5 h-5" /></button>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-700 font-sans">Official Certificate of Achievement</span>
                  <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">CERTIFICATE OF PARTICIPATION</h2>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed font-sans">
                  This is to certify that <strong className="text-slate-900 font-bold not-italic underline text-sm">{previewCertModal.studentName}</strong> has successfully participated in and completed
                </p>

                <h3 className="text-base font-bold text-slate-900 font-sans">{previewCertModal.eventTitle}</h3>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-left text-[11px] font-sans">
                  <div>
                    <span className="text-slate-400 block">Verified Digital Signature</span>
                    <strong className="text-slate-900 font-bold">{previewCertModal.organizerLead || 'Lead Chair'}</strong>
                    <span className="text-slate-500 block text-[9px]">{previewCertModal.organizerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-mono text-[9px]">{previewCertModal.hash}</span>
                    <span className="text-slate-700 font-bold">{previewCertModal.issueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDEE CHECKOUT MODAL */}
          {checkoutEvent && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Reserve Pass</h3>
                  <button onClick={() => setCheckoutEvent(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleConfirmPayment} className="space-y-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Selected Event</span>
                    <strong className="text-slate-900 font-bold text-sm block">{checkoutEvent.title}</strong>
                  </div>

                  {checkoutEvent.ticketTiers && checkoutEvent.ticketTiers.length > 0 && (
                    <div>
                      <label className="block text-slate-700 mb-1">Select Ticket Tier</label>
                      <div className="space-y-1.5">
                        {checkoutEvent.ticketTiers.map(t => (
                          <div
                            key={t.id || t.name}
                            onClick={() => setSelectedTier(t)}
                            className={`p-2.5 rounded-xl border cursor-pointer flex justify-between items-center transition ${selectedTier?.name === t.name ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50'}`}
                          >
                            <span className="font-bold text-slate-800">{t.name}</span>
                            <span className="font-bold text-blue-700">{t.price === 0 ? 'Free' : `₹${t.price}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-600">Total Payable:</span>
                    <strong className="text-slate-900 text-base font-bold">₹{selectedTier ? selectedTier.price : checkoutEvent.price}</strong>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50">
                    {isProcessing ? 'Processing Transaction...' : 'Confirm Booking & Issue Pass →'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
}