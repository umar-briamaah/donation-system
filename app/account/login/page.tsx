import LoginClient from './LoginClient';

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <LoginClient />;
}
