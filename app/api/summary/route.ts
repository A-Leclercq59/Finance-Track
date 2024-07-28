import { differenceInDays, parseISO, subDays } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { calculatePercentage, fillMissingDays } from "@/lib/utils";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountBankId: z.string().optional(),
});

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const user = await currentUser();

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

  async function fetchFinancialData(userId: string) {
    const income = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountBank: {
          userId: userId,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(accountBankId && {
          accountBankId: accountBankId,
        }),
        amount: {
          gte: 0,
        },
      },
    });

    const expenses = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountBank: {
          userId: userId,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(accountBankId && {
          accountBankId: accountBankId,
        }),
        amount: {
          lt: 0,
        },
      },
    });

    const remaining = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountBank: {
          userId: userId,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(accountBankId && {
          accountBankId: accountBankId,
        }),
      },
    });

    return {
      income: income._sum.amount || 0,
      expenses: expenses._sum.amount || 0,
      remaining: remaining._sum.amount || 0,
    };
  }

  const userId = user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentPeriod = await fetchFinancialData(userId);
  const lastPeriod = await fetchFinancialData(userId);

  const incomeChange = calculatePercentage(
    currentPeriod.income,
    lastPeriod.income
  );
  const expensesChange = calculatePercentage(
    currentPeriod.expenses,
    lastPeriod.expenses
  );
  const remainingChange = calculatePercentage(
    currentPeriod.remaining,
    lastPeriod.remaining
  );

  const categories = await db.transaction.groupBy({
    by: ["categorieId"],
    _sum: {
      amount: true,
    },
    where: {
      accountBank: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        lt: 0,
      },
      ...(accountBankId && {
        accountBankId: accountBankId,
      }),
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  // Étape 2: Récupérer les noms des catégories correspondant aux categorieId
  const categorieIds = categories
    .map((cat) => cat.categorieId)
    .filter((id) => id !== null);
  const categoryNames = await db.categorie.findMany({
    where: {
      id: {
        in: categorieIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Convertir la liste des noms des catégories en un objet pour un accès plus facile
  const categoryNameMap: { [key: string]: string } = categoryNames.reduce(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {} as { [key: string]: string }
  );

  // Étape 3: Formater les catégories pour inclure le nom
  const formattedCategories = categories.map((cat) => ({
    categorieId: cat.categorieId,
    name: cat.categorieId
      ? categoryNameMap[cat.categorieId] || "Unknown"
      : "Unknown",
    amount: cat._sum.amount ?? 0,
  }));

  // Sélectionner les 3 premières catégories et les autres
  const topCategories = formattedCategories.slice(0, 3);
  const otherCategories = formattedCategories.slice(3);

  // Calculer la somme des "autres" catégories
  const otherSum = otherCategories.reduce((acc, curr) => acc + curr.amount, 0);

  // Créer le tableau final des catégories
  const finalCategories = [...topCategories];
  if (otherCategories.length > 0) {
    finalCategories.push({
      categorieId: "Other",
      name: "Other",
      amount: otherSum,
    });
  }

  // Étape 1: Récupérer les transactions groupées par date avec des agrégations conditionnelles

  async function fetchActiveDays() {
    const activeDays = await db.transaction.groupBy({
      by: ["date"],
      _sum: {
        amount: true,
      },
      where: {
        accountBank: {
          userId: userId,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(accountBankId && {
          accountBankId: accountBankId,
        }),
      },
      orderBy: {
        date: "asc",
      },
    });

    const incomeAndExpenses = activeDays.map((day) => {
      const amount = day._sum.amount ?? 0;
      const income = amount >= 0 ? amount : 0;
      const expenses = amount < 0 ? amount : 0;
      return {
        date: day.date,
        income,
        expenses,
      };
    });

    return incomeAndExpenses;
  }

  const activeDays = await fetchActiveDays();

  const days = fillMissingDays(activeDays, startDate, endDate);

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
};
