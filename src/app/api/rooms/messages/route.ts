import { NextRequest, NextResponse } from 'next/server';

interface RoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

// In-memory storage (en producción usar Redis o DB)
const roomMessages = new Map<string, RoomMessage[]>();

// Import rooms map from parent (simplified - en producción usar DB)
const rooms = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, senderId, senderName, content } = body;

    if (!roomId || !senderId || !senderName || !content) {
      return NextResponse.json(
        { error: 'roomId, senderId, senderName, and content are required' },
        { status: 400 }
      );
    }

    // Verify room exists and is active (simplified check)
    const message: RoomMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId,
      senderName,
      content: content.trim(),
      timestamp: Date.now(),
    };

    const messages = roomMessages.get(roomId) || [];
    messages.push(message);
    roomMessages.set(roomId, messages);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      );
    }

    const messages = roomMessages.get(roomId) || [];
    
    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

