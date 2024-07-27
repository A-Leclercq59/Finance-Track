import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";
import { CreateCategoriesSchema } from "@/schemas/categories";

export const GET = async () => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const categories = await db.categorie.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  const user = await currentUser();

  const validationBody = CreateCategoriesSchema.safeParse(reqBody);

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
    const categorie = await db.categorie.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(categorie);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
