'use client';

import {useActionState} from 'react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

import {signInAction, type LoginState} from './actions';

export function LoginForm({next}: {next?: string}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signInAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@example.com"
          className="mt-1.5"
          aria-invalid={!!state.error}
        />
      </div>

      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="mt-1.5"
          aria-invalid={!!state.error}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full"
      >
        {pending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </Button>
    </form>
  );
}
