declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_API_AUTH: string
        NEXT_PUBLIC_API_HOST: string
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string
        HASH_SALT: string

        POSTGRES_USER: string
        POSTGRES_PASSWD: string
        POSTGRES_DATABASE: string
        POSTGRES_HOST: string

        SMTP_HOST: string
        SMTP_PORT: number
        SMTP_USER: string
        SMTP_PASS: string
        SMTP_FROM_EMAIL: string

        DATABASE_URL: string
    }
}