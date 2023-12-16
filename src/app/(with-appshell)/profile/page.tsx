import {Container} from "@mantine/core"
import {EditProfileForm} from "@/components/profile/EditProfileForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {FormLayout} from "@/layouts";
import {Profile} from "@prisma/client";
import db from "@/lib/db";


export default async function ProfilePage(props: { searchParams: { id?: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    let user: Profile | null = null

    if (props.searchParams.id) {
        if (session.user.role !== 'ADMIN') {
            redirect(PAGE_LINKS.PROFILE)
        }

        user = await db.profile.findUnique({where: {id: props.searchParams.id}})
        if (!user || user.id === session.user.id) {
            redirect(PAGE_LINKS.PROFILE)
        }
    }

    return <Container p={'md'}>
        <FormLayout>
            <EditProfileForm
                    initValues={{
                        email: user ? user.email : session.user.email as string,
                        role: user ? user.Role : session.user.role,
                    }}
                    id={user ? user.id : session.user.id}
                    isSameProfile={!user}
            />
        </FormLayout>
    </Container>
}