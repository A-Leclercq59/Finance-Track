import { NextResponse } from "next/server";

import { isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { CreateWireTransferSchema } from "@/schemas/transaction";

export const POST = async (req: Request) => {
  const reqBody = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = CreateWireTransferSchema.safeParse(reqBody);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const {
    amount,
    payee,
    notes,
    date,
    accountBankSourceId,
    accountBankTargetId,
    categorieId,
  } = validationBody.data;

  try {
    const transactionSource = await db.transaction.create({
      data: {
        amount: -amount,
        payee,
        notes,
        date,
        accountBankId: accountBankSourceId,
        categorieId,
      },
    });

    const transactionTarget = await db.transaction.create({
      data: {
        amount,
        payee,
        notes,
        date,
        accountBankId: accountBankTargetId,
        categorieId,
      },
    });

    return NextResponse.json({ transactionSource, transactionTarget });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
