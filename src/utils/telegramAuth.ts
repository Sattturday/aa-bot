import * as crypto from 'crypto';

export function validateInitData(initData: string, botToken: string): { valid: boolean; userId?: string } {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { valid: false };

    params.delete('hash');

    // Sort params alphabetically
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) return { valid: false };

    // Check auth_date is not too old (5 minutes)
    const authDate = parseInt(params.get('auth_date') || '0', 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 300) return { valid: false };

    // Extract user id
    const userStr = params.get('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return { valid: true, userId: String(user.id) };
    }

    return { valid: true };
  } catch {
    return { valid: false };
  }
}
