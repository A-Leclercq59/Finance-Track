import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { CreateAccountBankSchema } from "@/schemas/accountBank";

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
  const reqBody = await req.json();
  const user = await currentUser();

  const validationBody = CreateAccountBankSchema.safeParse(reqBody);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { name } = validationBody.data;

  if (!isAuth() || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!user?.id) {
    return new NextResponse("User ID not found", { status: 400 });
  }

  try {
    const account = await db.accountBank.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
