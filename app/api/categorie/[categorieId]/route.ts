import { NextResponse } from "next/server";

import { currentUser, isAuth } from "@/lib/auth/helper";
import { db } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { categorieId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const categorie = await db.categorie.findUnique({
      where: {
        userId: user?.id,
        id: params.categorieId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!categorie) {
      return new NextResponse("Account not found", { status: 404 });
    }

    return NextResponse.json(categorie);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { categorieId: string } }
) => {
  const user = await currentUser();
  const body = await req.json();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const categorie = await db.categorie.update({
      where: {
        id: params.categorieId,
        userId: user?.id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(categorie);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { categorieId: string } }
) => {
  const user = await currentUser();

  if (!isAuth()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const categorie = await db.categorie.delete({
      where: {
        id: params.categorieId,
        userId: user?.id,
      },
    });

    return NextResponse.json(categorie);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
