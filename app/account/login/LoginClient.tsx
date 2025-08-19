'use client';

import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import LoginForm from './LoginForm';

export default function LoginClient() {
  const auth = useSimpleAuth();
  
  return <LoginForm auth={auth} />;
}
