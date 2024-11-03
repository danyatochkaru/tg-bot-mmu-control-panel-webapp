import {Container} from "@mantine/core";
import {FormLayout} from "@/layouts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/login/LoginForm"))
const CreatePasswordForm = dynamic(() => import("@/components/login/CreatePasswordForm"))

async function fetchRequest(token: string) {
    const resRequest = await fetch(process.env.NEXTAUTH_URL + '/api/requests/check?token=' + token)
    return {data: await resRequest.json(), status: resRequest.ok}
}


async function LoginPage(props: { searchParams: { token?: string } }) {
    const session = await getServerSession(authOptions)

    if (!!session?.user) {
        redirect(PAGE_LINKS.HOME)
    }

    if (props.searchParams.token) {
        const {data, status} = await fetchRequest(props.searchParams.token)
        if (!status) {
            redirect(PAGE_LINKS.LOGIN + (data?.message ? `?message=${encodeURIComponent(data.message)}&messageColor=red` : ''))
        }
    }

    return (
            <Container p={'xl'}>
                <FormLayout>
                    {
                        !!props.searchParams.token
                                ? <CreatePasswordForm/>
                                : <LoginForm/>
                    }
                </FormLayout>
            </Container>
    );
}

export default LoginPage;