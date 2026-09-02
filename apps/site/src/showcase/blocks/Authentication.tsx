import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Mail } from '@/icons';
import { Button } from '@gerege/ui';
import { Input } from '@gerege/ui';
import { Alert } from '@gerege/ui';
import { Separator } from '@gerege/ui';
import { Github } from '@/icons';
import { useT } from '../i18n/locale';
import { authDict } from '../i18n/auth';

/* -----------------------------------------------------------------------------
 *  Validation — on blur after first interaction, then live on input for a
 *  field that already showed an error; never on the first keystroke (CANON).
 *  Errors render through `Input`'s `error` prop, which wires `aria-invalid`
 *  + `aria-describedby`. On submit every field is checked; with more than one
 *  error a summary is announced above the form.
 * --------------------------------------------------------------------------- */

type Errors<K extends string> = Partial<Record<K, string>>;

function useFormValidation<K extends string>(errors: Errors<K>) {
  const [touched, setTouched] = useState<Set<K>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const errorFor = (field: K) => (submitted || touched.has(field) ? errors[field] : undefined);
  const touch = (field: K) => setTouched((t) => (t.has(field) ? t : new Set(t).add(field)));
  const count = Object.values(errors).filter(Boolean).length;
  /** Mark everything touched; returns true when the form is valid. */
  const submit = () => {
    setSubmitted(true);
    return count === 0;
  };
  return { errorFor, touch, submit, summary: submitted && count > 1 ? errors : null };
}

function ErrorSummary({ errors }: { errors: Record<string, string | undefined> }) {
  const t = useT(authDict);
  const list = Object.values(errors).filter((e): e is string => Boolean(e));
  return (
    <Alert variant="danger" title={t('errSummary', { n: list.length })} live>
      <ul className="list-disc space-y-0.5 pl-4">
        {list.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </Alert>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type T = ReturnType<typeof useT<(typeof authDict)['en']>>;
const emailError = (t: T, v: string) =>
  !v.trim() ? t('errEmailEmpty') : !EMAIL_RE.test(v) ? t('errEmailInvalid') : undefined;

/* -----------------------------------------------------------------------------
 *  Authentication pattern — four screens that share the same shell.
 *
 *    <AuthLayout title="…" subtitle="…">…form…</AuthLayout>
 *
 *  Below: SignIn, SignUp, ForgotPassword, MagicLinkSent — each composed of
 *  primitives. They emit events; the host app handles network calls.
 * --------------------------------------------------------------------------- */

export interface AuthLayoutProps {
  /** Brand mark shown above the title. */
  brand?: ReactNode;
  /** Page heading. */
  title: ReactNode;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  /** Form / content. */
  children: ReactNode;
  /** Footer slot — "Don't have an account? Sign up". */
  footer?: ReactNode;
}

export function AuthLayout({ brand, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="bg-background-subtle grid min-h-dvh grid-cols-[minmax(0,1fr)] place-items-center px-4 py-12">
      <div className="w-full max-w-[400px] min-w-0 space-y-6">
        {brand && <div className="flex justify-center">{brand}</div>}
        <div className="space-y-2 text-center">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-foreground-muted text-sm">{subtitle}</p>}
        </div>
        <div className="border-border bg-card rounded-lg border p-6">{children}</div>
        {footer && <p className="text-foreground-muted text-center text-sm">{footer}</p>}
      </div>
    </main>
  );
}

export interface SsoButtonsProps {
  /** Called with the provider id. */
  onProvider?: (provider: 'google' | 'github') => void;
}

/**
 * SSO buttons above the credential form, separated by an "or" rule. Keep to
 * ≤2 providers on the sign-in card; more belong on a dedicated page.
 */
export function SsoButtons({ onProvider }: SsoButtonsProps) {
  const t = useT(authDict);
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          leadingIcon={<GoogleMark />}
          onClick={() => onProvider?.('google')}
        >
          {t('ssoGoogle')}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          leadingIcon={<Github />}
          onClick={() => onProvider?.('github')}
        >
          {t('ssoGithub')}
        </Button>
      </div>
      <div
        className="text-foreground-subtle flex items-center gap-3 text-xs tracking-wider uppercase"
        role="separator"
        aria-label={t('or')}
      >
        <Separator className="flex-1" />
        {t('or')}
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

/** Monochrome "G" — brand marks stay neutral on a refined-minimal surface. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6Z" />
    </svg>
  );
}

export interface SignInFormProps {
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
  /** Link target for "Forgot password?" (plain navigation). */
  forgotHref?: string;
  /** SPA handler for "Forgot password?" — takes precedence over `forgotHref`. */
  onForgot?: () => void;
}

export function SignInForm({
  onSubmit,
  loading,
  error,
  forgotHref = '/forgot',
  onForgot,
}: SignInFormProps) {
  const t = useT(authDict);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const v = useFormValidation<'email' | 'password'>({
    email: emailError(t, email),
    password: password ? undefined : t('errPasswordEmpty'),
  });

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (v.submit()) onSubmit({ email, password });
  };

  return (
    <form onSubmit={handle} className="space-y-4" noValidate>
      <SsoButtons />
      {v.summary ? (
        <ErrorSummary errors={v.summary} />
      ) : (
        error && (
          <Alert variant="danger" live>
            {error}
          </Alert>
        )
      )}
      <Input
        type="email"
        label={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => v.touch('email')}
        error={v.errorFor('email')}
        autoComplete="email"
        required
      />
      <Input
        type="password"
        label={t('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => v.touch('password')}
        error={v.errorFor('password')}
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-end text-sm">
        {onForgot ? (
          <button
            type="button"
            onClick={onForgot}
            className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t('forgotPassword')}
          </button>
        ) : (
          <a
            href={forgotHref}
            className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t('forgotPassword')}
          </a>
        )}
      </div>
      <Button type="submit" loading={loading} className="w-full" trailingIcon={<ArrowRight />}>
        {t('signIn')}
      </Button>
    </form>
  );
}

export interface SignUpFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
}

export function SignUpForm({ onSubmit, loading, error }: SignUpFormProps) {
  const t = useT(authDict);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const v = useFormValidation<'name' | 'email' | 'password'>({
    name: name.trim() ? undefined : t('errNameEmpty'),
    email: emailError(t, email),
    password: password.length >= 8 ? undefined : t('errPasswordShort'),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v.submit()) onSubmit({ name, email, password });
      }}
      className="space-y-4"
      noValidate
    >
      <SsoButtons />
      {v.summary ? (
        <ErrorSummary errors={v.summary} />
      ) : (
        error && (
          <Alert variant="danger" live>
            {error}
          </Alert>
        )
      )}
      <Input
        label={t('fullName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => v.touch('name')}
        error={v.errorFor('name')}
        autoComplete="name"
        required
      />
      <Input
        type="email"
        label={t('workEmail')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => v.touch('email')}
        error={v.errorFor('email')}
        autoComplete="email"
        required
      />
      <Input
        type="password"
        label={t('password')}
        helperText={t('passwordHint')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => v.touch('password')}
        error={v.errorFor('password')}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        {t('createAccount')}
      </Button>
      <p className="text-foreground-subtle text-center text-xs">{t('terms')}</p>
    </form>
  );
}

export interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
}

export function ForgotPasswordForm({ onSubmit, loading, error }: ForgotPasswordFormProps) {
  const t = useT(authDict);
  const [email, setEmail] = useState('');
  const v = useFormValidation<'email'>({ email: emailError(t, email) });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v.submit()) onSubmit(email);
      }}
      className="space-y-4"
      noValidate
    >
      {error && (
        <Alert variant="danger" live>
          {error}
        </Alert>
      )}
      <Input
        type="email"
        label={t('email')}
        helperText={t('forgotHelper')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => v.touch('email')}
        error={v.errorFor('email')}
        autoComplete="email"
        required
      />
      <Button type="submit" loading={loading} className="w-full" leadingIcon={<Mail />}>
        {t('sendResetLink')}
      </Button>
    </form>
  );
}

export interface MagicLinkSentProps {
  email: string;
  onResend?: () => void;
}

export function MagicLinkSent({ email, onResend }: MagicLinkSentProps) {
  const t = useT(authDict);
  return (
    <div className="space-y-4 text-center">
      <div className="bg-success-soft text-success-text mx-auto inline-flex size-12 items-center justify-center rounded-full">
        <CheckCircle2 className="size-6" aria-hidden />
      </div>
      <p className="text-foreground-muted text-sm">
        {t('sentBefore')}
        <span className="text-foreground font-medium">{email}</span>
        {t('sentAfter')}
      </p>
      <Separator />
      <p className="text-foreground-subtle text-xs">
        {t('didntGet')}{' '}
        <button
          type="button"
          onClick={onResend}
          className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {t('resend')}
        </button>
      </p>
    </div>
  );
}
