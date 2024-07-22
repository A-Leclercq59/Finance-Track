import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { accountBankId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const account = await db.accountBank.findUnique({
      where: {
        userId: user?.id,
        id: params.accountBankId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { accountBankId: string } }
) => {
  const user = await currentUser();
  const body = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const account = await db.accountBank.update({
      where: {
        id: params.accountBankId,
        userId: user?.id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { accountBankId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const account = await db.accountBank.delete({
      where: {
        id: params.accountBankId,
        userId: user?.id,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
