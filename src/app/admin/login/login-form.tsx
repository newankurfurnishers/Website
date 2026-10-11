"use client";

import { useActionState } from "react";
import { type LoginState, signIn } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={action} className="grid gap-4">
      {state.error && (
        <p role="alert" className="rounded-lg bg-walnut/10 px-4 py-3 text-sm text-walnut">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-lg border border-forest/20 bg-white px-3.5 py-2.5 focus-visible:border-forest"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-lg border border-forest/20 bg-white px-3.5 py-2.5 focus-visible:border-forest"
        />
      </div>
      <button type="submit" disabled={pending} className="btn btn-dark mt-2 justify-center disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
