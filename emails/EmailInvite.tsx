import {PAGE_LINKS} from "@/constants/page-links";
import {Invite} from "@prisma/client";
import {Container, Html, Link, Section, Text} from "@react-email/components";

export default function EmailInvite(token: Invite['token']) {
    return (
            <Html lang={'ru'}>
                <Section style={{backgroundColor: '#fff'}}>
                    <Container>
                        <Text>Вы были приглашены в систему отправки рассылки бота ММУ.</Text>
                        <Text>Чтобы принять приглашение, нажмите на кнопку {'"Принять"'} ниже:</Text>
                        <Link style={{color: '#ffd600', textDecoration: 'underline', textUnderlinePosition: 'under'}}
                              href={`${process.env.NEXTAUTH_URL + PAGE_LINKS.LOGIN}?token=${token}`}>Принять</Link>
                    </Container>
                </Section>
            </Html>
    )
}