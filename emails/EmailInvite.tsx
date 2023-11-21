import {Html} from "@react-email/html";
import {Section} from "@react-email/section";
import {Container} from "@react-email/container";
import {Text} from "@react-email/text";
import {Link} from "@react-email/link";

export default function EmailInvite(token?: string) {
    return (
            <Html lang={'ru'}>
                <Section style={{backgroundColor: '#fff'}}>
                    <Container>
                        <Text>Чтобы принять приглашения, перейдите по ссылке ниже:</Text>
                        <Link style={{color: '#ffd600', textDecoration: 'underline', textUnderlinePosition: 'under'}}
                              href={`${process.env.NEXTAUTH_URL}/login?token=${token ?? "dev"}`}>Принять</Link>
                    </Container>
                </Section>
            </Html>
    )
}