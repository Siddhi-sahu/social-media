import prisma from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//TODO: add image/etc
//TODO: add likes
const createPostSchema = z.object({
    content: z.string(),
    providerId: z.string()
});
export async function POST(req: NextRequest) {
    try {
        const parseResult = createPostSchema.safeParse(await req.json());
        if (!parseResult.success) {
            return NextResponse.json({
                msg: "Invalid Input"
            }, {
                status: 400
            });

        }

        const data = parseResult.data;
        const providerId = data.providerId;
        const user = await prisma.user.findUnique({
            where: { providerId }
        })
        if (!user) {
            return NextResponse.json({
                msg: "No user with the providerId"
            }, {
                status: 404
            })
        }

        //create db entry
        const post = await prisma.post.create({
            data: {
                content: data.content,
                userId: user?.id
            }
        });

        return NextResponse.json({
            msg: "Post Added successfully",
            postId: post.id

        });


    } catch (e) {
        console.log(e);
        return NextResponse.json({
            msg: "Error while adding post"
        }, {
            status: 411
        })
    }
}


export async function GET(req: NextRequest) {

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({
            msg: "User id is required"
        }, {
            status: 400
        })
    }
    try {

        const posts = await prisma.post.findMany({
            where: {
                userId: Number(userId),
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            posts
        })
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            msg: "error fetching user posts"
        }, {
            status: 411
        })

    }


}
//all posts

