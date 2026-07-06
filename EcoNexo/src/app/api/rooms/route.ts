import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rooms (en producción usarías una base de datos)
interface DigitalRoom {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  autoDestroyMinutes: number;
  participants: string[];
  messages: RoomMessage[];
  isActive: boolean;
}

interface RoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

// In-memory storage (en producción usar Redis o DB)
const rooms = new Map<string, DigitalRoom>();
const roomMessages = new Map<string, RoomMessage[]>();

// Cleanup expired rooms every minute
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (room.expiresAt <= now && room.isActive) {
      room.isActive = false;
      roomMessages.delete(roomId);
      console.log(`Room ${roomId} auto-destroyed`);
    }
  }
}, 60000); // Check every minute

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, createdBy, autoDestroyMinutes } = body;

    if (!name || !createdBy || !autoDestroyMinutes) {
      return NextResponse.json(
        { error: 'name, createdBy, and autoDestroyMinutes are required' },
        { status: 400 }
      );
    }

    // Validate autoDestroyMinutes (between 5 and 1440 minutes = 24 hours)
    const minutes = Math.max(5, Math.min(1440, parseInt(autoDestroyMinutes)));
    const expiresAt = Date.now() + (minutes * 60 * 1000);

    const room: DigitalRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      createdBy,
      createdAt: Date.now(),
      expiresAt,
      autoDestroyMinutes: minutes,
      participants: [createdBy],
      messages: [],
      isActive: true,
    };

    rooms.set(room.id, room);
    roomMessages.set(room.id, []);

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        expiresAt: room.expiresAt,
        autoDestroyMinutes: room.autoDestroyMinutes,
        participants: room.participants,
        isActive: room.isActive,
      },
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (roomId) {
      // Get specific room
      const room = rooms.get(roomId);
      if (!room) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      // Check if expired
      if (room.expiresAt <= Date.now()) {
        room.isActive = false;
        return NextResponse.json(
          { error: 'Room has expired', room: { ...room, isActive: false } },
          { status: 410 }
        );
      }

      return NextResponse.json({
        success: true,
        room: {
          id: room.id,
          name: room.name,
          description: room.description,
          createdAt: room.createdAt,
          expiresAt: room.expiresAt,
          autoDestroyMinutes: room.autoDestroyMinutes,
          participants: room.participants,
          isActive: room.isActive,
          timeRemaining: Math.max(0, room.expiresAt - Date.now()),
        },
      });
    }

    if (userId) {
      // Get rooms for user (where they are participant)
      const userRooms = Array.from(rooms.values())
        .filter(room => room.participants.includes(userId) && room.isActive)
        .map(room => ({
          id: room.id,
          name: room.name,
          description: room.description,
          createdAt: room.createdAt,
          expiresAt: room.expiresAt,
          autoDestroyMinutes: room.autoDestroyMinutes,
          participants: room.participants,
          isActive: room.isActive,
          timeRemaining: Math.max(0, room.expiresAt - Date.now()),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      return NextResponse.json({
        success: true,
        rooms: userRooms,
      });
    }

    // Get all active rooms
    const activeRooms = Array.from(rooms.values())
      .filter(room => room.isActive && room.expiresAt > Date.now())
      .map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        expiresAt: room.expiresAt,
        autoDestroyMinutes: room.autoDestroyMinutes,
        participants: room.participants,
        isActive: room.isActive,
        timeRemaining: Math.max(0, room.expiresAt - Date.now()),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({
      success: true,
      rooms: activeRooms,
    });
  } catch (error) {
    console.error('Error getting rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, userId, action } = body;

    if (!roomId || !userId || !action) {
      return NextResponse.json(
        { error: 'roomId, userId, and action are required' },
        { status: 400 }
      );
    }

    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    if (room.expiresAt <= Date.now()) {
      room.isActive = false;
      return NextResponse.json(
        { error: 'Room has expired' },
        { status: 410 }
      );
    }

    if (action === 'join') {
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
      }
    } else if (action === 'leave') {
      room.participants = room.participants.filter(id => id !== userId);
    }

    rooms.set(roomId, room);

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        expiresAt: room.expiresAt,
        autoDestroyMinutes: room.autoDestroyMinutes,
        participants: room.participants,
        isActive: room.isActive,
        timeRemaining: Math.max(0, room.expiresAt - Date.now()),
      },
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

