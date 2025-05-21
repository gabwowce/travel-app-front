// src/hooks/useInitAuth.ts
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setCredentials, clearAuth } from '@/src/data/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from "@/src/hooks/LazyHooks";

export function useInitAuth() {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const [getUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userJson = await SecureStore.getItemAsync('user');
        if (!token || !userJson) throw new Error('Missing');

        const user = JSON.parse(userJson);
        dispatch(setCredentials({ token, user }));

        const { error } = await getUser().unwrap();
        if (error) throw new Error('Invalid token');

        setReady(true);
      } catch (err) {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        dispatch(clearAuth());
        setReady(true);
      }
    })();
  }, []);

  return ready;
}
