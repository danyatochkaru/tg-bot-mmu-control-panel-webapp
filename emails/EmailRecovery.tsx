import {Recovery} from "@prisma/client";
import {PAGE_LINKS} from "@/constants/page-links";
import {Container, Html, Link, Section, Text} from "@react-email/components";

export default function EmailRecovery(token: Recovery['token']) {
    return (
            <Html lang={'ru'}>
                <Section style={{backgroundColor: '#fff'}}>
                    <Container>
                        <Text>Вы получили данное письмо потому, что ваша почта была указана для восстановления
                            пароля. Если это были не вы, просто проигнорируйте</Text>
                        <Text>Чтобы обновить пароль, нажмите на кнопку {'"Восстановить пароль"'} ниже:</Text>
                        <Link style={{color: '#ffd600', textDecoration: 'underline', textUnderlinePosition: 'under'}}
                              href={`${process.env.NEXTAUTH_URL + PAGE_LINKS.RECOVERY}?token=${token}`}>Восстановить
                            пароль</Link>
                    </Container>
                </Section>
            </Html>
    )
}