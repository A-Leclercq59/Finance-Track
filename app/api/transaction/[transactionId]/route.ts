import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { EditTransactionSchema } from "@/schemas/transaction";

export const GET = async (
  req: Request,
  { params }: { params: { transactionId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const transaction = await db.transaction.findFirst({
      where: {
        id: params.transactionId,
        accountBank: {
          userId: user?.id,
        },
      },
      include: {
        accountBank: true,
        categorie: true,
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { transactionId: string } }
) => {
  const user = await currentUser();
  const body = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = EditTransactionSchema.safeParse(body);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { amount, payee, notes, date, accountBankId, categorieId } =
    validationBody.data;

  try {
    const transaction = await db.transaction.updateMany({
      where: {
        id: params.transactionId,
        accountBank: {
          userId: user?.id,
        },
      },
      data: {
        amount,
        payee,
        notes,
        date,
        accountBankId,
        categorieId,
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { transactionId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const transaction = await db.transaction.deleteMany({
      where: {
        id: params.transactionId,
        accountBank: {
          userId: user?.id,
        },
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
