import { differenceInDays, parseISO, subDays } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { calculatePercentage, fillMissingDays } from "@/lib/utils";
import { Prisma } from "@prisma/client";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountBankId: z.string().optional(),
});

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const user = await currentUser();

  const userId = user?.id;

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const validationBody = querySchema.safeParse(queryParams);

  if (!validationBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: validationBody.error.errors },
      { status: 400 }
    );
  }

  const { accountBankId, from, to } = validationBody.data;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = from ? parseISO(from) : defaultFrom;
  const endDate = to ? parseISO(to) : defaultTo;
  const periodLength = differenceInDays(endDate, startDate) + 1;
  const lastPeriodStart = subDays(startDate, periodLength);
  const lastPeriodEnd = subDays(endDate, periodLength);

  type FinancialDataResult = {
    income: number | null;
    expenses: number | null;
    remaining: number | null;
  };

  async function fetchFinancialData(startedDate: Date, endDate: Date) {
    const result = await db.$queryRaw<FinancialDataResult[]>`
      SELECT
        SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) AS income,
        SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END) AS expenses,
        SUM(t.amount) AS remaining
      FROM "Transaction" t
      INNER JOIN "AccountBank" a ON t."accountBankId" = a.id
      WHERE a."userId" = ${userId}
        AND t.date >= ${startedDate}
        AND t.date <= ${endDate}
        ${
          accountBankId ? Prisma.sql`AND a.id = ${accountBankId}` : Prisma.empty
        }
    `;

    return {
      income: result[0].income ? Number(result[0].income) : 0,
      expenses: result[0].expenses ? Number(result[0].expenses) : 0,
      remaining: result[0].remaining ? Number(result[0].remaining) : 0,
    };
  }

  try {
    const currentPeriod = await fetchFinancialData(startDate, endDate);
    const lastPeriod = await fetchFinancialData(lastPeriodStart, lastPeriodEnd);

    const incomeChange = calculatePercentage(
      currentPeriod.income ?? 0,
      lastPeriod.income ?? 0
    );
    const expensesChange = calculatePercentage(
      currentPeriod.expenses ?? 0,
      lastPeriod.expenses ?? 0
    );
    const remainingChange = calculatePercentage(
      currentPeriod.remaining ?? 0,
      lastPeriod.remaining ?? 0
    );

    type CategoryResult = {
      name: string;
      value: number;
    };

    const categories = await db.$queryRaw<CategoryResult[]>`
      SELECT
        c.name,
        SUM(ABS(t.amount)) AS value
      FROM "Transaction" t
      INNER JOIN "AccountBank" a ON t."accountBankId" = a.id
      INNER JOIN "Categorie" c ON t."categorieId" = c.id
      WHERE a."userId" = ${userId}
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
        AND t.amount < 0
        ${
          accountBankId ? Prisma.sql`AND a.id = ${accountBankId}` : Prisma.empty
        }
      GROUP BY c.name
      ORDER BY value DESC
    `;

    const topCategories = categories.slice(0, 3);
    const otherCategories = categories.slice(3);
    const otherSum = otherCategories.reduce((acc, curr) => acc + curr.value, 0);
    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({ name: "Other", value: otherSum });
    }

    type ActiveDayResult = {
      date: Date;
      income: number;
      expenses: number;
    };

    const activeDays = await db.$queryRaw<ActiveDayResult[]>`
      SELECT
        t.date,
        SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END) AS income,
        SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) AS expenses
      FROM "Transaction" t
      INNER JOIN "AccountBank" a ON t."accountBankId" = a.id
      WHERE a."userId" = ${userId}
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
        ${
          accountBankId ? Prisma.sql`AND a.id = ${accountBankId}` : Prisma.empty
        }
      GROUP BY t.date
      ORDER BY t.date ASC
    `;

    const formattedActiveDays = activeDays.map((day) => ({
      date: day.date,
      income: day.income !== null ? Number(day.income) : 0,
      expenses: day.expenses !== null ? Number(day.expenses) : 0,
    }));

    const days = fillMissingDays(formattedActiveDays, startDate, endDate);

    return NextResponse.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange: remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange: incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange: expensesChange,
        categories: finalCategories,
        days,
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
