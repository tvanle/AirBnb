import { NextResponse } from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export async function GET(request: Request) {
        var session =  await getServerSession(authOptions);
        return NextResponse.json(session);
}