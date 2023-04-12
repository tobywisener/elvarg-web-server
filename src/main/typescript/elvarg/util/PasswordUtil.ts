import bcrypt from "bcrypt";

export class PasswordUtil {
    private static pbkdf2 = 10;

    public static async generatePasswordHashWithSalt(password: string): Promise<string> {
        const saltRounds = this.pbkdf2;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        return salt + ":" + hash;
    }

    public static async passwordsMatch(plainTextPassword: string, passwordHashWithSalt: string): Promise<boolean> {
        const parts = passwordHashWithSalt.split(":");
        const salt = parts[0];
        const hash = parts[1];

        return await bcrypt.compare(plainTextPassword, hash);
    }

    private static toBase64(s: string): string {
        return Buffer.from(s).toString('base64');
    }

    private static fromBase64(s: string): string {
        return Buffer.from(s, 'base64').toString();

    }
}
