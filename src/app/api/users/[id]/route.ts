import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import * as z from "zod";
import {Role} from "@prisma/client";
import db from "@/lib/db";
import {comparePassword, hashPassword} from "@/utils/hashPassword";

const editUserSchema = z.object({
    email: z.string().email(),
    new_password: z.string().trim().min(5).optional(),
    password: z.string().optional(),
    role: z.enum([Role.USER, Role.ADMIN]).optional(),
})

export async function PATCH(req: Request, {params}: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 401})
        }

        const body = await req.json()

        const {email, new_password, password, role} = editUserSchema.parse(body)

        const [existingProfile, editor] = await Promise.all([
            db.profile.findUnique({where: {id: params.id}}),
            db.profile.findUnique({where: {id: session.user.sub}}),
        ])

        if (!existingProfile || !editor) {
            return NextResponse.json({message: 'Пользователь не найден'}, {status: 400})
        }

        if (editor.id !== existingProfile.id) {
            if (editor.Role !== 'ADMIN') {
                return NextResponse.json({message: 'Недостаточно прав'}, {status: 403})
            }
        } else {
            if (!password) {
                return NextResponse.json({message: 'Не был передан обязательный параметр'}, {status: 400})
            }

            if (!comparePassword(existingProfile.password, password, process.env.HASH_SALT!)) {
                return NextResponse.json({message: 'Неверный пароль'}, {status: 400})
            }
        }

        if (role && editor.Role !== 'ADMIN') {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 403})
        }

        const updatedProfile = await db.profile.update({
            where: {id: existingProfile.id},
            data: {
                email,
                password: new_password ? hashPassword(new_password, process.env.HASH_SALT!) : existingProfile.password,
                Role: role ? role : existingProfile.Role,
            }
        })

        return NextResponse.json({profile: updatedProfile, message: 'Данные профиля успешно изменены'}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}