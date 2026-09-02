import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  RadioGroup,
  RadioItem,
  Stepper,
} from '@gerege-systems/ui';

export function CheckoutSteps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Vertical below sm: three horizontal steps clip the last label once
            the card is narrower than about 380px. */}
        <Stepper
          current={1}
          orientation="vertical"
          className="sm:hidden"
          steps={[{ title: 'Contact' }, { title: 'Delivery' }, { title: 'Payment' }]}
        />
        <Stepper
          current={1}
          className="hidden sm:flex"
          steps={[{ title: 'Contact' }, { title: 'Delivery' }, { title: 'Payment' }]}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="City" defaultValue="Ulaanbaatar" />
          <Input label="District" placeholder="Sükhbaatar" />
        </div>
        <Input label="Address" placeholder="Building, entrance, apartment" />
        <RadioGroup defaultValue="standard" className="flex flex-col gap-3">
          <RadioItem value="standard" label="Standard — 8,000₮" description="2–4 working days" />
          <RadioItem value="express" label="Express — 18,000₮" description="Next working day" />
          <RadioItem
            value="pickup"
            label="Pick-up — free"
            description="From the warehouse, 9:00–18:00"
          />
        </RadioGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Continue to payment</Button>
        <Button variant="ghost">Back</Button>
      </CardFooter>
    </Card>
  );
}
