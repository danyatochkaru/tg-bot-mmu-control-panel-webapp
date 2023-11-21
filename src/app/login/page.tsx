import {Container} from "@mantine/core";
import {CreatePasswordForm, LoginForm} from "@/components/loginPage";
import {FormLayout} from "@/layouts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

async function fetchRequest(token: string) {
    const resRequest = await fetch(process.env.NEXTAUTH_URL + '/api/requests/check?token=' + token)
    if (!resRequest.ok) return undefined
    return resRequest.json()
}


async function LoginPage(props: { searchParams: { token?: string } }) {
    const session = await getServerSession(authOptions)

    if (!!session?.user) {
        redirect(PAGES_LINK.HOME)
    }

    if (props.searchParams.token) {
        const request = await fetchRequest(props.searchParams.token)
        if (!request) {
            redirect(PAGES_LINK.LOGIN)
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