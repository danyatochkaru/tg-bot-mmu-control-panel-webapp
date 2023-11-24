import {Html} from "@react-email/html";
import {Section} from "@react-email/section";
import {Container} from "@react-email/container";
import {Text} from "@react-email/text";
import {Link} from "@react-email/link";
import {PAGES_LINK} from "@/constants/PAGES_LINK";
import {Invite} from "@prisma/client";

export default function EmailInvite(token: Invite['token']) {
    return (
            <Html lang={'ru'}>
                <Section style={{backgroundColor: '#fff'}}>
                    <Container>
                        <Text>Вы были приглашены в систему отправки рассылки бота ММУ.</Text>
                        <Text>Чтобы принять приглашения, нажмите на кнопку {'"Принять"'} ниже:</Text>
                        <Link style={{color: '#ffd600', textDecoration: 'underline', textUnderlinePosition: 'under'}}
                              href={`${process.env.NEXTAUTH_URL + PAGES_LINK.LOGIN}?token=${token}`}>Принять</Link>
                    </Container>
                </Section>
            </Html>
    )
}