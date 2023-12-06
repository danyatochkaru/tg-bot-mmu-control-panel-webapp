import {Container} from "@mantine/core";
import {CreatePasswordForm, LoginForm} from "@/components/login";
import {FormLayout} from "@/layouts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

async function fetchRequest(token: string) {
    const resRequest = await fetch(process.env.NEXTAUTH_URL + '/api/requests/check?token=' + token)
    return {data: await resRequest.json(), status: resRequest.ok}
}


async function LoginPage(props: { searchParams: { token?: string } }) {
    const session = await getServerSession(authOptions)

    if (!!session?.user) {
        redirect(PAGES_LINK.HOME)
    }

    if (props.searchParams.token) {
        const {data, status} = await fetchRequest(props.searchParams.token)
        if (!status) {
            redirect(PAGES_LINK.LOGIN + (data?.message ? `?message=${encodeURIComponent(data.message)}&messageColor=red` : ''))
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