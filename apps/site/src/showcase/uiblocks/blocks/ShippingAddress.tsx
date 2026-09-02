import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@gerege-systems/ui';

export function ShippingAddress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping address</CardTitle>
        <p className="text-foreground-subtle text-xs">Where should we deliver?</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="Street address" placeholder="Chinggis Avenue 12" autoComplete="off" />
        <Input label="Building / apartment" placeholder="Block B, apt 42" autoComplete="off" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="City" defaultValue="Ulaanbaatar" autoComplete="off" />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">District</span>
            <Select defaultValue="sbd">
              <SelectTrigger aria-label="District" />
              <SelectContent>
                <SelectItem value="sbd">Sükhbaatar</SelectItem>
                <SelectItem value="bzd">Bayanzürkh</SelectItem>
                <SelectItem value="hud">Khan-Uul</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Postcode" placeholder="14200" inputMode="numeric" autoComplete="off" />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Country</span>
            <Select defaultValue="mn">
              <SelectTrigger aria-label="Country" />
              <SelectContent>
                <SelectItem value="mn">Mongolia</SelectItem>
                <SelectItem value="kr">South Korea</SelectItem>
                <SelectItem value="cn">China</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Checkbox defaultChecked label="Save as my default address" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="ghost">Cancel</Button>
        <span className="grow" />
        <Button>Save address</Button>
      </CardFooter>
    </Card>
  );
}
