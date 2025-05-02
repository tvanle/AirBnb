import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { broadcastMessage } from '@/lib/websocket';

interface IParams {
  chatId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { chatId } = params;

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!chatId) {
      return new NextResponse('Chat ID is required', { status: 400 });
    }

    // Verify user is part of the chat
    const userInChat = await prisma.userChat.findFirst({
      where: {
        userId: currentUser.id,
        chatId: chatId,
      },
    });

    if (!userInChat) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        content,
        chatId,
        userId: currentUser.id,
      },
      include: {
        user: true,
      },
    });

    // Broadcast message to clients in the chat
    broadcastMessage(chatId, {
      event: 'new-message',
      data: message,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { chatId } = params;

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!chatId) {
      return new NextResponse('Chat ID is required', { status: 400 });
    }

    // Verify user is part of the chat
    const userInChat = await prisma.userChat.findFirst({
      where: {
        userId: currentUser.id,
        chatId: chatId,
      },
    });

    if (!userInChat) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get messages for chat
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('[MESSAGES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}