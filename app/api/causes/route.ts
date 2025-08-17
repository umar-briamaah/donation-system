import { NextRequest, NextResponse } from 'next/server';

// Mock causes data - in real app, fetch from database
const mockCauses = [
  {
    id: '1',
    title: "Clean Water for Rural Communities",
    description: "Help provide clean drinking water to rural communities in developing countries. This initiative aims to build wells and water purification systems to serve over 10,000 people.",
    image: "/images/water-cause.jpg",
    goal: 50000,
    raised: 35000,
    category: "Health & Sanitation",
    featured: true,
    status: "ACTIVE",
    location: "Rural Africa",
    deadline: "2024-12-31",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-08-15T00:00:00Z"
  },
  {
    id: '2',
    title: "Education for Underprivileged Children",
    description: "Support education initiatives for children who cannot afford school supplies and tuition. Help break the cycle of poverty through education.",
    image: "/images/education-cause.jpg",
    goal: 30000,
    raised: 22000,
    category: "Education",
    featured: false,
    status: "ACTIVE",
    location: "South Asia",
    deadline: "2024-11-30",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-08-10T00:00:00Z"
  },
  {
    id: '3',
    title: "Emergency Relief for Natural Disasters",
    description: "Provide immediate relief and support to communities affected by natural disasters. Help rebuild lives and communities.",
    image: "/images/relief-cause.jpg",
    goal: 75000,
    raised: 45000,
    category: "Emergency Relief",
    featured: true,
    status: "ACTIVE",
    location: "Global",
    deadline: "2024-10-31",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-08-12T00:00:00Z"
  },
  {
    id: '4',
    title: "Medical Supplies for Rural Clinics",
    description: "Provide essential medical supplies and equipment to rural clinics serving underserved communities.",
    image: "/images/medical-cause.jpg",
    goal: 40000,
    raised: 28000,
    category: "Healthcare",
    featured: false,
    status: "ACTIVE",
    location: "Latin America",
    deadline: "2024-12-15",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-08-08T00:00:00Z"
  },
  {
    id: '5',
    title: "Sustainable Agriculture Training",
    description: "Train farmers in sustainable agricultural practices to improve food security and economic stability.",
    image: "/images/agriculture-cause.jpg",
    goal: 25000,
    raised: 15000,
    category: "Agriculture",
    featured: false,
    status: "ACTIVE",
    location: "East Africa",
    deadline: "2025-01-31",
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-08-05T00:00:00Z"
  },
  {
    id: '6',
    title: "Women's Empowerment Programs",
    description: "Support programs that provide skills training, education, and resources to empower women in developing communities.",
    image: "/images/women-cause.jpg",
    goal: 35000,
    raised: 20000,
    category: "Women's Rights",
    featured: true,
    status: "ACTIVE",
    location: "South Asia",
    deadline: "2024-11-15",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredCauses = [...mockCauses];

    // Apply filters
    if (category && category !== 'All') {
      filteredCauses = filteredCauses.filter(cause => cause.category === category);
    }

    if (featured === 'true') {
      filteredCauses = filteredCauses.filter(cause => cause.featured);
    }

    if (status) {
      filteredCauses = filteredCauses.filter(cause => cause.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCauses = filteredCauses.filter(cause => 
        cause.title.toLowerCase().includes(searchLower) ||
        cause.description.toLowerCase().includes(searchLower) ||
        cause.category.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCauses = filteredCauses.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalCauses = filteredCauses.length;
    const totalPages = Math.ceil(totalCauses / limit);

    return NextResponse.json({
      causes: paginatedCauses,
      pagination: {
        page,
        limit,
        totalCauses,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching causes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, goal, category, location, deadline } = body;

    // Validate required fields
    if (!title || !description || !goal || !category || !location || !deadline) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // In real app, save to database
    const newCause = {
      id: Date.now().toString(),
      title,
      description,
      goal: parseFloat(goal),
      raised: 0,
      category,
      location,
      deadline,
      featured: false,
      status: "ACTIVE",
      image: "/images/default-cause.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Mock adding to array
    mockCauses.push(newCause);

    return NextResponse.json(newCause, { status: 201 });

  } catch (error) {
    console.error('Error creating cause:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
