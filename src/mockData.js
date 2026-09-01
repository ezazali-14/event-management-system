// src/mockData.js

export const initialOrganizers = [
  {
    id: 'org_tech',
    name: 'Tech & Innovation Society',
    email: 'tech@eventhub.com',
    password: 'tech123',
    department: 'Department of Computer Science & Engineering',
    lead: 'Dr. Ramesh Sharma',
    contact: '+91 98765 43210',
    bio: 'Conducting campus hackathons, edge IoT buildathons, and developer masterclasses.'
  },
  {
    id: 'org_cult',
    name: 'Cultural & Performing Arts Council',
    email: 'cultural@eventhub.com',
    password: 'cult123',
    department: 'Student Affairs & Cultural Board',
    lead: 'Prof. Ananya Sen',
    contact: '+91 98450 11223',
    bio: 'Organizing live band concerts, drama competitions, acoustic nights, and creative workshops.'
  },
  {
    id: 'org_sports',
    name: 'Sports & Athletics Federation',
    email: 'sports@eventhub.com',
    password: 'sport123',
    department: 'Physical Education Department',
    lead: 'Coach Vikram Rathore',
    contact: '+91 97112 33445',
    bio: 'Hosting inter-college tournaments, esports arenas, and athletic sprint events.'
  },
  {
    id: 'org_biz',
    name: 'E-Cell & Entrepreneurship Board',
    email: 'ecell@eventhub.com',
    password: 'biz123',
    department: 'Center for Innovation & Enterprise',
    lead: 'Dr. Priya Nambiar',
    contact: '+91 99001 88776',
    bio: 'Empowering student founders with venture capital bootcamps and startup summits.'
  }
];

export const initialEvents = [
  {
    id: 'evt-tech-01',
    organizerId: 'org_tech',
    organizerName: 'Tech & Innovation Society',
    title: 'National AI & Edge Compute Hackathon 2026',
    category: 'Hackathons & Tech',
    date: '2026-09-20',
    time: '09:00 AM',
    location: 'Main Auditorium, Block A',
    price: 0,
    totalTickets: 150,
    soldTickets: 112,
    description: 'A 24-hour national hackathon focused on building edge IoT pipelines, intelligent agent workflows, and data systems.',
    ticketTiers: [
      { id: 'tier-1', name: 'General Student Hacker Pass', price: 0, capacity: 100 },
      { id: 'tier-2', name: 'VIP Hardware & Microcontroller Access', price: 149, capacity: 50 }
    ]
  },
  {
    id: 'evt-tech-02',
    organizerId: 'org_tech',
    organizerName: 'Tech & Innovation Society',
    title: 'System Design & Kubernetes Masterclass',
    category: 'Workshops & Bootcamps',
    date: '2026-09-28',
    time: '10:00 AM',
    location: 'Computer Systems Lab 4',
    price: 199,
    totalTickets: 80,
    soldTickets: 64,
    description: 'Hands-on training covering container orchestration, microservice architectures, and scalable API gateways.',
    ticketTiers: [
      { id: 'tier-1', name: 'Standard Developer Seat', price: 199, capacity: 60 },
      { id: 'tier-2', name: 'Premium 1-on-1 Mentor Desk Pass', price: 349, capacity: 20 }
    ]
  },
  {
    id: 'evt-cult-01',
    organizerId: 'org_cult',
    organizerName: 'Cultural & Performing Arts Council',
    title: 'Annual Campus Rock Fest & Battle of Bands',
    category: 'Cultural & Music',
    date: '2026-10-02',
    time: '05:30 PM',
    location: 'Open Air Amphitheatre',
    price: 250,
    totalTickets: 300,
    soldTickets: 240,
    description: 'Headlining 8 collegiate rock and fusion bands, acoustic solos, and student food pop-ups.',
    ticketTiers: [
      { id: 'tier-1', name: 'General Admission', price: 250, capacity: 200 },
      { id: 'tier-2', name: 'Front Row Fan Pit Pass', price: 499, capacity: 100 }
    ]
  },
  {
    id: 'evt-cult-02',
    organizerId: 'org_cult',
    organizerName: 'Cultural & Performing Arts Council',
    title: 'Inter-College Street Play & Drama Gala',
    category: 'Cultural & Music',
    date: '2026-10-18',
    time: '11:00 AM',
    location: 'Quadrangle Stage',
    price: 0,
    totalTickets: 180,
    soldTickets: 130,
    description: 'Original stage productions and street plays spotlighting contemporary social themes.',
    ticketTiers: [
      { id: 'tier-1', name: 'Free Audience Entry', price: 0, capacity: 180 }
    ]
  },
  {
    id: 'evt-sports-01',
    organizerId: 'org_sports',
    organizerName: 'Sports & Athletics Federation',
    title: 'Inter-University Valorant & BGMI LAN Arena',
    category: 'Sports & Esports',
    date: '2026-10-06',
    time: '10:00 AM',
    location: 'Indoor Esports Arena, Block C',
    price: 300,
    totalTickets: 128,
    soldTickets: 110,
    description: '5v5 tactical shooter and mobile battle royale tournament with high-refresh display setups and trophies.',
    ticketTiers: [
      { id: 'tier-1', name: 'Player Competitor Slot', price: 300, capacity: 80 },
      { id: 'tier-2', name: 'Spectator VIP Lounge Pass', price: 150, capacity: 48 }
    ]
  },
  {
    id: 'evt-sports-02',
    organizerId: 'org_sports',
    organizerName: 'Sports & Athletics Federation',
    title: 'Autumn Open Badminton Knockout',
    category: 'Sports & Esports',
    date: '2026-10-15',
    time: '08:00 AM',
    location: 'University Badminton Courts',
    price: 100,
    totalTickets: 64,
    soldTickets: 52,
    description: 'Men and women singles and mixed doubles knockout bracket officiated by certified referees.',
    ticketTiers: [
      { id: 'tier-1', name: 'Singles Knockout Entry', price: 100, capacity: 64 }
    ]
  }
];

export const initialAttendeePasses = [
  {
    bookingId: 'PASS-842910',
    eventId: 'evt-tech-01',
    eventTitle: 'National AI & Edge Compute Hackathon 2026',
    organizerId: 'org_tech',
    attendeeName: 'Thuregal Mohammed Ezaz Ali',
    attendeeEmail: 'attendee@eventhub.com',
    tierName: 'General Student Hacker Pass',
    pricePaid: 0,
    paymentMethod: 'Instant Free Pass',
    bookingDate: '2026-08-20',
    date: '2026-09-20',
    time: '09:00 AM',
    location: 'Main Auditorium, Block A',
    checkedIn: true,
    checkInTime: '08:45 AM'
  },
  {
    bookingId: 'PASS-772101',
    eventId: 'evt-cult-01',
    eventTitle: 'Annual Campus Rock Fest & Battle of Bands',
    organizerId: 'org_cult',
    attendeeName: 'Thuregal Mohammed Ezaz Ali',
    attendeeEmail: 'attendee@eventhub.com',
    tierName: 'General Admission',
    pricePaid: 250,
    paymentMethod: 'UPI (GPay)',
    bookingDate: '2026-08-22',
    date: '2026-10-02',
    time: '05:30 PM',
    location: 'Open Air Amphitheatre',
    checkedIn: false
  }
];

export const initialRosterData = [
  {
    bookingId: 'PASS-842910',
    eventId: 'evt-tech-01',
    eventTitle: 'National AI & Edge Compute Hackathon 2026',
    organizerId: 'org_tech',
    attendeeName: 'Thuregal Mohammed Ezaz Ali',
    attendeeEmail: 'attendee@eventhub.com',
    tierName: 'General Student Hacker Pass',
    pricePaid: 0,
    paymentMethod: 'Instant Free Pass',
    bookingDate: '2026-08-20',
    checkedIn: true,
    checkInTime: '08:45 AM'
  },
  {
    bookingId: 'PASS-842911',
    eventId: 'evt-tech-01',
    eventTitle: 'National AI & Edge Compute Hackathon 2026',
    organizerId: 'org_tech',
    attendeeName: 'Dokku Rithwik',
    attendeeEmail: 'rithwik.d@gmail.com',
    tierName: 'VIP Hardware & Microcontroller Access',
    pricePaid: 149,
    paymentMethod: 'UPI (PhonePe)',
    bookingDate: '2026-08-21',
    checkedIn: true,
    checkInTime: '09:12 AM'
  },
  {
    bookingId: 'PASS-913401',
    eventId: 'evt-tech-02',
    eventTitle: 'System Design & Kubernetes Masterclass',
    organizerId: 'org_tech',
    attendeeName: 'Aarav Mehta',
    attendeeEmail: 'aarav.m@gmail.com',
    tierName: 'Standard Developer Seat',
    pricePaid: 199,
    paymentMethod: 'UPI (PhonePe)',
    bookingDate: '2026-08-24',
    checkedIn: false
  },
  {
    bookingId: 'PASS-772101',
    eventId: 'evt-cult-01',
    eventTitle: 'Annual Campus Rock Fest & Battle of Bands',
    organizerId: 'org_cult',
    attendeeName: 'Thuregal Mohammed Ezaz Ali',
    attendeeEmail: 'attendee@eventhub.com',
    tierName: 'General Admission',
    pricePaid: 250,
    paymentMethod: 'UPI (GPay)',
    bookingDate: '2026-08-22',
    checkedIn: false
  }
];

export const initialVolunteers = [
  {
    id: 'vol-1',
    organizerId: 'org_tech',
    name: 'Rahul Verma',
    email: 'rahul.v@campus.edu',
    role: 'Gate Volunteer',
    eventId: 'evt-tech-01',
    eventTitle: 'National AI & Edge Compute Hackathon 2026',
    status: 'Active',
    assignedDate: '2026-08-15'
  },
  {
    id: 'vol-2',
    organizerId: 'org_tech',
    name: 'Ananya Sharma',
    email: 'ananya.s@campus.edu',
    role: 'Coordinator',
    eventId: 'evt-tech-01',
    eventTitle: 'National AI & Edge Compute Hackathon 2026',
    status: 'Active',
    assignedDate: '2026-08-18'
  },
  {
    id: 'vol-3',
    organizerId: 'org_cult',
    name: 'Karan Malhotra',
    email: 'karan.m@campus.edu',
    role: 'Gate Volunteer',
    eventId: 'evt-cult-01',
    eventTitle: 'Annual Campus Rock Fest & Battle of Bands',
    status: 'Active',
    assignedDate: '2026-08-20'
  },
  {
    id: 'vol-4',
    organizerId: 'org_sports',
    name: 'Priya Nambiar',
    email: 'priya.n@campus.edu',
    role: 'Finance Lead',
    eventId: 'evt-sports-01',
    eventTitle: 'Inter-University Valorant & BGMI LAN Arena',
    status: 'Active',
    assignedDate: '2026-08-22'
  }
];

export const initialPayouts = [
  {
    id: 'PAYOUT-8849201',
    organizerId: 'org_tech',
    amount: 12736,
    bankName: 'HDFC Bank',
    accountNo: '•••• 8821',
    date: '2026-08-25',
    status: 'Completed',
    refNo: 'UTR-HDFC-99812401'
  },
  {
    id: 'PAYOUT-7719202',
    organizerId: 'org_cult',
    amount: 49200,
    bankName: 'State Bank of India (SBI)',
    accountNo: '•••• 4410',
    date: '2026-08-26',
    status: 'Completed',
    refNo: 'UTR-SBI-44102941'
  }
];

export const defaultAttendeeProfile = {
  name: 'Thuregal Mohammed Ezaz Ali',
  email: 'attendee@eventhub.com',
  phone: '+91 98765 00112',
  institution: 'CMR College of Engineering & Technology',
  department: 'Data Science & IoT Systems',
  studentId: 'CMRCET-DS-2026-084'
};

export const pastCompletedEvents = [
  {
    certificateId: 'CERT-2026-9041',
    title: 'Cloud Native & Edge Computing Sprint 2026',
    organizer: 'Tech & Innovation Society',
    date: 'July 14, 2026',
    venue: 'Block A Auditorium'
  },
  {
    certificateId: 'CERT-2026-7819',
    title: 'Inter-College Web Innovation Hackathon',
    organizer: 'Tech & Innovation Society',
    date: 'June 22, 2026',
    venue: 'Computer Science Complex'
  }
];