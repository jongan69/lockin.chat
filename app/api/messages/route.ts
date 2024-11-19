// route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is required');
}
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

const messageSchema = new mongoose.Schema({
  text: String,
  role: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { text, role } = body;
  if (!text) {
    return Response.json({ error: 'Message text is required' });
  }
  try {
    const message = new Message({ text, role });
    await message.save();
    return Response.json({ message });
} catch (error) {
    return Response.json({ error: 'Failed to save message' });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    return Response.json(messages);
  } catch (error) {
    return Response.json({ error: 'Failed to retrieve messages' });
  }
}