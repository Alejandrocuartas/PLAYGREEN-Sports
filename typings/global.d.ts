
type UserSession = {
    user_id: number;
    username: string;
    role: UserRole;
}

type CustomRequest = {
    user: UserSession;
}
