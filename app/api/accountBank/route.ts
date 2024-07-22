import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";

export const GET = async () => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const accounts = await db.accountBank.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const user = await currentUser();
  const body = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const account = await db.accountBank.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
