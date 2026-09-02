import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from '@gerege/ui';
import type { TemplateProps } from './meta';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from './Authentication';
import { readHashParams } from './admin/use-hash-params';
import { useT } from '../i18n/locale';
import { authDict } from '../i18n/auth';

/**
 * Authentication template — the full auth flow on the single-column, centred AuthLayout:
 * sign in, sign up, forgot password and the magic-link confirmation. The links
 * are real: footer links and "Forgot password?" move between the screens (you
 * can also jump straight to any screen from the preview dock). Submitting the
 * forgot form advances to the magic-link confirmation.
 */
const noop = async () => {};

/**
 * Demo network: 800ms of `loading`, then success — or the error branch when
 * the preview URL carries `?demo=error` (`#preview/auth/signin?demo=error`).
 */
function useDemoSubmit(screen: string) {
  const t = useT(authDict);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<number>();
  // Reset when the screen changes; clear a pending timer on unmount.
  useEffect(() => {
    setLoading(false);
    setError(null);
    setDone(false);
    return () => window.clearTimeout(timer.current);
  }, [screen]);
  const submit = (onSuccess?: () => void) => {
    setError(null);
    setDone(false);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      if (readHashParams().get('demo') === 'error') {
        setError(t('demoError'));
      } else {
        setDone(true);
        onSuccess?.();
      }
    }, 800);
  };
  return { loading, error, done, submit };
}

function DemoHint() {
  const t = useT(authDict);
  return (
    <span className="text-foreground-subtle block text-xs">
      {t('demoHintBefore')}
      <code>?demo=error</code>
      {t('demoHintAfter')}
    </span>
  );
}

function FootLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

export function AuthTemplate({ screen, setScreen, brand }: TemplateProps) {
  const t = useT(authDict);
  const demo = useDemoSubmit(screen);
  const success = demo.done && (
    <Alert variant="success" live className="mb-4">
      {t('demoSuccess')}
    </Alert>
  );
  switch (screen) {
    case 'signup':
      return (
        <AuthLayout
          brand={brand}
          title={t('signUpTitle')}
          subtitle={t('signUpSubtitle')}
          footer={
            <>
              {t('haveAccount')}{' '}
              <FootLink onClick={() => setScreen('signin')}>{t('signIn')}</FootLink>
              <DemoHint />
            </>
          }
        >
          {success}
          <SignUpForm onSubmit={() => demo.submit()} loading={demo.loading} error={demo.error} />
        </AuthLayout>
      );
    case 'forgot':
      return (
        <AuthLayout
          brand={brand}
          title={t('forgotTitle')}
          subtitle={t('forgotSubtitle')}
          footer={
            <>
              <FootLink onClick={() => setScreen('signin')}>{t('backToSignIn')}</FootLink>
            </>
          }
        >
          <ForgotPasswordForm
            onSubmit={() => demo.submit(() => setScreen('magic'))}
            loading={demo.loading}
            error={demo.error}
          />
        </AuthLayout>
      );
    case 'magic':
      return (
        <AuthLayout
          brand={brand}
          title={t('magicTitle')}
          subtitle={t('magicSubtitle')}
          footer={
            <>
              <FootLink onClick={() => setScreen('signin')}>{t('backToSignIn')}</FootLink>
            </>
          }
        >
          <MagicLinkSent email="you@example.com" onResend={noop} />
        </AuthLayout>
      );
    default:
      return (
        <AuthLayout
          brand={brand}
          title={t('signInTitle')}
          subtitle={t('signInSubtitle')}
          footer={
            <>
              {t('noAccount')}{' '}
              <FootLink onClick={() => setScreen('signup')}>{t('signUp')}</FootLink>
              <DemoHint />
            </>
          }
        >
          {success}
          <SignInForm
            onSubmit={() => demo.submit()}
            loading={demo.loading}
            error={demo.error}
            onForgot={() => setScreen('forgot')}
          />
        </AuthLayout>
      );
  }
}
