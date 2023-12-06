import {Container} from "@mantine/core";
import {NewProfileForm} from "@/components/profile/NewProfileForm";
import {FormLayout} from "@/layouts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

async function NewProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGES_LINK.LOGIN)
    }

    if (session.user.role !== 'ADMIN') {
        const message = encodeURIComponent('Недостаточно прав')
        return redirect(PAGES_LINK.HOME + `?message=${message}&messageColor=red`)
    }

    return (
            <Container p={'xl'}>
                <FormLayout>
                    <NewProfileForm/>
                </FormLayout>
            </Container>
    );
}

export default NewProfilePage;