'use client';

import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import RegisterForm from './RegisterForm';

export default function RegisterClient() {
  const auth = useSimpleAuth();
  
  return <RegisterForm auth={auth} />;
}
