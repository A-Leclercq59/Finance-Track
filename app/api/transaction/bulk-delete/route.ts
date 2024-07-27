import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { DeleteBulkTransactionSchema } from "@/schemas/transaction";

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  const user = await currentUser();

  const validationBody = DeleteBulkTransactionSchema.safeParse(reqBody);

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { ids } = validationBody.data;

  try {
    const transactions = await db.transaction.deleteMany({
      where: {
        id: { in: ids },
        accountBank: {
          userId: user?.id,
        },
      },
    });

    return NextResponse.json({ data: transactions });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
