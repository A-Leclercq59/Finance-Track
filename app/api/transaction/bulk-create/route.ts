import { NextResponse } from "next/server";

import { isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { BulkCreateTransactionSchema } from "@/schemas/transaction";

export const POST = async (req: Request) => {
  const reqBody = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = BulkCreateTransactionSchema.safeParse(reqBody);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const transactions = validationBody.data;

  try {
    const createdTransactionIds: string[] = [];

    for (const transaction of transactions) {
      const createdTransaction = await db.transaction.create({
        data: {
          amount: transaction.amount,
          payee: transaction.payee,
          notes: transaction.notes,
          date: transaction.date,
          accountBankId: transaction.accountBankId,
          categorieId: transaction.categorieId,
        },
      });

      createdTransactionIds.push(createdTransaction.id);
    }

    const createdTransactionDetails = await db.transaction.findMany({
      where: {
        id: {
          in: createdTransactionIds,
        },
      },
      include: {
        accountBank: true,
        categorie: true,
      },
    });

    return NextResponse.json(createdTransactionDetails);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
