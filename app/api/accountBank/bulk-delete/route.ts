import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { DeleteBulkAccountBankSchema } from "@/schemas/accountBank";

export const POST = async (req: Request) => {
  const reqBody = await req.json();

  const validationBody = DeleteBulkAccountBankSchema.safeParse(reqBody);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { ids } = validationBody.data;

  const user = await currentUser();

  if (!isAuth() || !user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedAccounts = await db.accountBank.deleteMany({
      where: {
        userId: user.id,
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({ data: deletedAccounts });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
