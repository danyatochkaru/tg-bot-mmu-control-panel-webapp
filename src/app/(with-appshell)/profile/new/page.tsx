import {Container} from "@mantine/core";
import {NewProfileForm} from "@/components/profile/NewProfileForm";
import {FormLayout} from "@/layouts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";

async function NewProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    if (session.user.role !== 'ADMIN') {
        const message = encodeURIComponent('Недостаточно прав')
        return redirect(PAGE_LINKS.HOME + `?message=${message}&messageColor=red`)
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