import {Recovery} from "@prisma/client";
import {Html} from "@react-email/html";
import {Container} from "@react-email/container";
import {Text} from "@react-email/text";
import {Link} from "@react-email/link";
import {PAGE_LINKS} from "@/constants/page-links";
import {Section} from "@react-email/section";

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