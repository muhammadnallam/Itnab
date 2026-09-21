export function isAdmin(user) {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail || !user?.email) return false;
    return user.email.trim().toLowerCase() === adminEmail;
}
