import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Form, FormControl, FormError, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { CodeBlock } from '../widgets/CodeBlock';

interface FormValues {
  email: string;
  password: string;
  marketing: boolean;
}

function FormDemo() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const form = useForm<FormValues>({
    defaultValues: { email: '', password: '', marketing: true },
  });

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => setSubmitted(v))}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketing"
              render={({ field }) => (
                <FormItem className="border-border bg-background-subtle flex items-center justify-between rounded-md border px-3 py-2">
                  <FormLabel className="!m-0">Marketing emails</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Marketing emails"
                      hideLabel
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>

        {submitted && (
          <div className="border-border bg-background-muted rounded-md border p-3 text-xs">
            <p className="text-foreground mb-1 font-medium">Submitted values:</p>
            <pre
              className="scroll-region overflow-x-auto font-mono"
              tabIndex={0}
              role="region"
              aria-label="Submitted values"
            >
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FormsBody() {
  return (
    <div className="prose-block">
      <h2>Why react-hook-form</h2>
      <p>
        Battle-tested, fast (no re-render storm), tiny, and works with any validation library (Zod,
        Yup, custom). All <code>@gerege/ui</code> inputs forward refs correctly so they slot into
        RHF without adapters.
      </p>

      <h2>Live sign-in demo</h2>
      <p>
        Try submitting with an empty or invalid email — errors are wired through{' '}
        <code>FormError</code> automatically.
      </p>
      <FormDemo />

      <h2>The composition</h2>
      <CodeBlock
        code={`import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormError, Input, Button } from '@gerege/ui';

const form = useForm({ defaultValues: { email: '', password: '' } });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      rules={{ required: 'Required', pattern: /\\S+@\\S+\\.\\S+/ }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormError />
        </FormItem>
      )}
    />
    <Button type="submit">Sign in</Button>
  </form>
</Form>`}
      />

      <h2>With Zod</h2>
      <CodeBlock
        code={`import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({ resolver: zodResolver(schema) });`}
      />

      <h2>Tips</h2>
      <ul>
        <li>
          <code>FormLabel</code>, <code>FormControl</code>, and <code>FormError</code> auto-link via{' '}
          <code>aria-describedby</code> + <code>aria-invalid</code>.
        </li>
        <li>
          Switch / Checkbox bind via <code>field.value</code> + <code>field.onChange</code> — not{' '}
          <code>field</code> spread.
        </li>
        <li>
          For async validation, return a Promise from <code>rules.validate</code>.
        </li>
      </ul>
    </div>
  );
}
