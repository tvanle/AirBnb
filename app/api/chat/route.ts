// import { NextResponse } from "next/server";
// import prisma from "@/lib/prismadb";
// import getCurrentUser from "@/app/actions/getCurrentUser";
//
// export async function POST(request: Request) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//
//     const body = await request.json();
//     const { participantId } = body;
//
//     if (!participantId) {
//       return new NextResponse("Participant ID is required", { status: 400 });
//     }
//
//     // Create a new chat
//     const chat = await prisma.chat.create({
//       data: {
//         participants: {
//           create: [
//             { userId: currentUser.id },
//             { userId: participantId }
//           ]
//         }
//       },
//       include: {
//         participants: {
//           include: {
//             user: true
//           }
//         }
//       }
//     });
//
//     return NextResponse.json(chat);
//   } catch (error) {
//     console.error("[CHAT_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
//
// export async function GET(request: Request) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//
//     // Get all chats for current user
//     const chats = await prisma.chat.findMany({
//       where: {
//         participants: {
//           some: {
//             userId: currentUser.id
//           }
//         }
//       },
//       include: {
//         participants: {
//           include: {
//             user: true
//           }
//         },
//         messages: {
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 1,
//           include: {
//             user: true
//           }
//         }
//       }
//     });
//
//     return NextResponse.json(chats);
//   } catch (error) {
//     console.error("[CHAT_GET]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
