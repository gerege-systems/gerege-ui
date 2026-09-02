import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Switch,
} from '@gerege-systems/ui';

export function App() {
  const [name, setName] = useState('');
  const [notify, setNotify] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Hello, __PROJECT_NAME__</CardTitle>
            <CardDescription>
              Your new app is wired up with @gerege-systems/ui. Edit{' '}
              <code className="rounded bg-background-muted px-1">src/App.tsx</code> to start
              building.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bay"
            />
            <Switch
              label="Email notifications"
              checked={notify}
              onCheckedChange={setNotify}
            />
            <Button disabled={!name}>{name ? `Hi, ${name}` : 'Enter your name'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
