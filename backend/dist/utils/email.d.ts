/**
 * Send OTP verification email.
 * If EMAIL_USER / EMAIL_PASS are not configured, logs the OTP to the console
 * instead of crashing — useful during local development without a mail server.
 */
export declare const sendOTPEmail: (to: string, otp: string, name: string) => Promise<void>;
//# sourceMappingURL=email.d.ts.map