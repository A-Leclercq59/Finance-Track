import { parseISO, subDays } from "date-fns";
import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import {
  CreateTransactionSchema,
  GetTransactionQuerySchema,
} from "@/schemas/transaction";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = GetTransactionQuerySchema.safeParse(queryParams);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { accountId, from, to } = validationBody.data;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);
  const startDate = from ? parseISO(from) : defaultFrom;
  const endDate = to ? parseISO(to) : defaultTo;

  let dateConditions = {};
  if (from) {
    dateConditions = { ...dateConditions, gte: startDate };
  }
  if (to) {
    dateConditions = { ...dateConditions, lte: endDate };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {
        accountBank: {
          userId: user?.id,
        },
        date: dateConditions,
        accountBankId: accountId || undefined,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        accountBank: {
          select: {
            name: true,
          },
        },
        categorie: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const reqBody = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = CreateTransactionSchema.safeParse(reqBody);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { amount, payee, notes, date, accountBankId, categorieId } =
    validationBody.data;

  try {
    const transaction = await db.transaction.create({
      data: {
        amount,
        payee,
        notes,
        date,
        accountBankId,
        categorieId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
