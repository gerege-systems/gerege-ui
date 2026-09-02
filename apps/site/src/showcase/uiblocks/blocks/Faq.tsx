import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gerege-systems/ui';

export function Faq() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>What is the refund policy?</AccordionTrigger>
            <AccordionContent>14 days, no questions asked.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Do you support SSO?</AccordionTrigger>
            <AccordionContent>OIDC and SAML on Business and above.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Can I export my data?</AccordionTrigger>
            <AccordionContent>CSV and JSON — Settings → Export.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
