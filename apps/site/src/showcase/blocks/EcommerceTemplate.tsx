import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  X,
  ImageIcon,
} from '@/icons';
import { Badge } from '@gerege-systems/ui';
import { Button } from '@gerege-systems/ui';
import { Card, CardContent } from '@gerege-systems/ui';
import { EmptyState } from '@gerege-systems/ui';
import { IconButton } from '@gerege-systems/ui';
import { Input } from '@gerege-systems/ui';
import { Separator } from '@gerege-systems/ui';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@gerege-systems/ui';
import { cn, formatMNT, formatNumber } from '@gerege-systems/ui';
import type { TemplateProps } from './meta';
import { readHashParams, writeHash } from './admin/use-hash-params';
import { useT, type Locale } from '../i18n/locale';
import { ecommerceDict } from '../i18n/ecommerce';

/**
 * E-commerce template — storefront grid, product detail, and cart, all sharing
 * a shop header. Fully interactive without a backend: the cart, quantity
 * steppers, wishlist hearts, category filter and search all run on local
 * state. All copy (chrome + catalogue names) comes from `i18n/ecommerce.ts`;
 * prices are USD in EN and demo-converted tögrög in MN.
 */
const CATEGORIES = ['all', 'audio', 'wearables', 'home', 'accessories'] as const;
type Category = (typeof CATEGORIES)[number];

const PRODUCTS = [
  { id: 'aura', price: 249, rating: 4.8, tag: 'audio', hue: 250 },
  { id: 'pulse', price: 199, rating: 4.6, tag: 'wearables', hue: 160 },
  { id: 'lumen', price: 89, rating: 4.9, tag: 'home', hue: 65 },
  { id: 'drift', price: 129, rating: 4.5, tag: 'audio', hue: 290 },
  { id: 'field', price: 149, rating: 4.7, tag: 'accessories', hue: 30 },
  { id: 'nest', price: 179, rating: 4.4, tag: 'audio', hue: 200 },
] as const satisfies readonly { tag: Category; [k: string]: unknown }[];

type Product = (typeof PRODUCTS)[number];
type ProductId = Product['id'];
/** Cart keyed by product id (names are locale-dependent). */
type Cart = Partial<Record<ProductId, number>>;

type T = ReturnType<typeof useT<typeof ecommerceDict.en>>;
const catLabel = (t: T, c: Category) => t(`cat.${c}`);
const itemName = (t: T, id: ProductId) => t(`item.${id}`);

/** Demo USD → MNT conversion, rounded to the nearest thousand (rate is illustrative). */
const USD_TO_MNT = 3410;
const usdToMnt = (usd: number) => Math.round((usd * USD_TO_MNT) / 1000) * 1000;

/** EN: `$249.00` (grouped, two decimals). MN: `849,000₮` via the library's `formatMNT`. */
const money = (usd: number, locale: Locale) =>
  locale === 'mn'
    ? formatMNT(usdToMnt(usd))
    : `$${formatNumber(usd, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type HelpTopic = 'shipping' | 'returns' | 'support';
const HELP: readonly HelpTopic[] = ['shipping', 'returns', 'support'];
const helpTitle = (t: T, h: HelpTopic) => t(`help.${h}.title`);

/** Image placeholder — a flat, per-category tinted surface (solid colour mixed
 *  into the muted background, so it follows light/dark) with a faint image
 *  glyph. No gradient (PHILOSOPHY). Swap for `<img>` with width/height in a
 *  real feed. */
function Shot({ hue = 250, className }: { hue?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('text-foreground/15 flex items-center justify-center', className)}
      style={{
        background: `color-mix(in oklch, var(--background-muted) 78%, oklch(0.62 0.14 ${hue}))`,
      }}
    >
      <ImageIcon className="size-8" strokeWidth={1.25} />
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-warning-text inline-flex items-center gap-1 text-xs">
      <Star className="size-3.5 fill-current" aria-hidden />
      <span className="tabular text-foreground-muted">{rating.toFixed(1)}</span>
    </span>
  );
}

function QtyStepper({
  qty,
  onChange,
  min = 1,
}: {
  qty: number;
  onChange: (q: number) => void;
  min?: number;
}) {
  const t = useT(ecommerceDict);
  return (
    <div className="border-border inline-flex items-center rounded-md border">
      <IconButton
        aria-label={t('qty.decrease')}
        icon={<Minus />}
        variant="ghost"
        size="sm"
        disabled={qty <= min}
        onClick={() => onChange(qty - 1)}
      />
      <span className="tabular w-8 text-center text-sm">{qty}</span>
      <IconButton
        aria-label={t('qty.increase')}
        icon={<Plus />}
        variant="ghost"
        size="sm"
        onClick={() => onChange(qty + 1)}
      />
    </div>
  );
}

function ShopHeader({
  brand,
  cartCount,
  onCart,
  onCategory,
  query,
  onQuery,
}: {
  brand: React.ReactNode;
  cartCount: number;
  onCart: () => void;
  onCategory: (c: Category) => void;
  query?: string;
  onQuery?: (q: string) => void;
}) {
  const t = useT(ecommerceDict);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchable = Boolean(onQuery);

  return (
    <header className="border-border bg-background sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 md:gap-6">
        {/* Categories move into a drawer below md. */}
        <Sheet>
          <SheetTrigger asChild>
            <IconButton
              aria-label={t('nav.openMenu')}
              icon={<Menu />}
              variant="ghost"
              size="sm"
              className="md:hidden"
            />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined} side="left" className="w-72">
            <SheetTitle>{t('nav.shop')}</SheetTitle>
            <nav aria-label={t('nav.categories')} className="mt-6 flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <SheetClose asChild key={c}>
                  <button
                    type="button"
                    onClick={() => onCategory(c)}
                    className="text-foreground hover:bg-background-muted flex h-11 items-center rounded-md px-3 text-left text-base"
                  >
                    {catLabel(t, c)}
                  </button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 truncate text-sm">{brand}</div>
        <nav
          aria-label={t('nav.categories')}
          className="text-foreground-muted hidden items-center gap-5 text-sm md:flex"
        >
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategory(c)}
              className="hover:text-foreground"
            >
              {catLabel(t, c)}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1">
          {searchable && searchOpen ? (
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- field is revealed by the user's own "search" click; focusing it is the expected result
                autoFocus
                size="sm"
                label={t('nav.searchProducts')}
                hideLabel
                placeholder={t('nav.searchPlaceholder')}
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="w-full max-w-xs"
              />
              <IconButton
                aria-label={t('nav.closeSearch')}
                icon={<X />}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onQuery?.('');
                  setSearchOpen(false);
                }}
              />
            </div>
          ) : (
            <IconButton
              aria-label={t('nav.search')}
              icon={<Search />}
              variant="ghost"
              size="sm"
              onClick={searchable ? () => setSearchOpen(true) : undefined}
            />
          )}
          <button
            onClick={onCart}
            aria-label={t('nav.cart')}
            className="text-foreground-muted hover:bg-background-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-md"
          >
            <ShoppingCart className="size-4" aria-hidden />
            {cartCount > 0 && (
              <span className="bg-accent text-on-accent absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-xs font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function ShopFooter({ onHelp }: { onHelp: (topic: HelpTopic) => void }) {
  const t = useT(ecommerceDict);
  return (
    <footer className="border-border bg-background-subtle mt-auto border-t">
      <div className="text-foreground-subtle mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs sm:px-6">
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <nav aria-label={t('footer.help')} className="flex gap-4">
          {HELP.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onHelp(h)}
              className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {helpTitle(t, h)}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/** Help / policies — in-template destination for the footer links. */
function HelpScreen({
  brand,
  topic,
  cartCount,
  onCart,
  onCategory,
  onShop,
  onHelp,
}: {
  brand: React.ReactNode;
  topic: HelpTopic;
  cartCount: number;
  onCart: () => void;
  onCategory: (c: Category) => void;
  onShop: () => void;
  onHelp: (topic: HelpTopic) => void;
}) {
  const t = useT(ecommerceDict);
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <button
          onClick={onShop}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> {t('shop.back')}
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">{helpTitle(t, topic)}</h1>
        <p className="text-foreground-muted mt-3 max-w-[65ch] text-sm leading-relaxed">
          {t(`help.${topic}.body`)}
        </p>
        <Separator className="my-8" />
        <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
          {t('help.more')}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {HELP.filter((h) => h !== topic).map((h) => (
            <li key={h}>
              <button
                type="button"
                onClick={() => onHelp(h)}
                className="text-accent font-medium hover:underline"
              >
                {helpTitle(t, h)}
              </button>
            </li>
          ))}
        </ul>
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function Shop({
  brand,
  onOpen,
  onCart,
  onHelp,
  cartCount,
  category,
  setCategory,
}: {
  brand: React.ReactNode;
  onOpen: (id: ProductId) => void;
  onCart: () => void;
  onHelp: (topic: HelpTopic) => void;
  cartCount: number;
  category: Category;
  setCategory: (c: Category) => void;
}) {
  const t = useT(ecommerceDict);
  const [query, setQuery] = useState('');
  const [wishlist, setWishlist] = useState<Set<ProductId>>(new Set());

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.tag === category) &&
        (!q || itemName(t, p.id).toLowerCase().includes(q)),
    );
  }, [category, query, t]);

  const toggleWish = (id: ProductId) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader
        brand={brand}
        cartCount={cartCount}
        onCart={onCart}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('shop.title')}</h1>
            <p className="text-foreground-muted mt-1 text-sm">{t('shop.subtitle')}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                category === c
                  ? 'border-accent bg-accent-soft text-on-accent-soft'
                  : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground'
              }`}
            >
              {catLabel(t, c)}
            </button>
          ))}
        </div>
        {products.length === 0 ? (
          <div className="border-border bg-card mt-8 rounded-lg border p-10 text-center">
            <p className="text-sm font-medium">{t('shop.empty.title')}</p>
            <p className="text-foreground-muted mt-1 text-sm">
              {query.trim()
                ? t('shop.empty.query', { query: query.trim(), category: catLabel(t, category) })
                : t('shop.empty.category', { category: catLabel(t, category) })}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
            >
              {t('shop.clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {products.map((p) => {
              const name = itemName(t, p.id);
              const wished = wishlist.has(p.id);
              return (
                <Card key={p.id} padding="none" className="group overflow-hidden">
                  <div className="relative">
                    <button
                      onClick={() => onOpen(p.id)}
                      aria-label={t('shop.view', { name })}
                      className="block w-full text-left"
                    >
                      <Shot hue={p.hue} className="aspect-square w-full" />
                    </button>
                    <button
                      onClick={() => toggleWish(p.id)}
                      aria-label={t(wished ? 'shop.wishRemove' : 'shop.wishAdd', { name })}
                      aria-pressed={wished}
                      className={`bg-card absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full transition-colors ${
                        wished ? 'text-danger-text' : 'text-foreground-muted hover:text-foreground'
                      }`}
                    >
                      <Heart className={`size-3.5 ${wished ? 'fill-current' : ''}`} aria-hidden />
                    </button>
                  </div>
                  <button onClick={() => onOpen(p.id)} className="block w-full p-4 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="neutral" variant="outline">
                        {catLabel(t, p.tag)}
                      </Badge>
                      <Stars rating={p.rating} />
                    </div>
                    <h3 className="text-foreground group-hover:text-accent mt-2 text-sm leading-snug font-medium">
                      {name}
                    </h3>
                    <div className="tabular text-foreground mt-1 font-semibold">
                      {money(p.price, t.locale)}
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function ProductScreen({
  brand,
  id,
  onCart,
  onBack,
  onHelp,
  cartCount,
  addToCart,
  onCategory,
}: {
  brand: React.ReactNode;
  id: string;
  onCart: () => void;
  onBack: () => void;
  onHelp: (topic: HelpTopic) => void;
  cartCount: number;
  addToCart: (id: ProductId, qty: number) => void;
  onCategory: (c: Category) => void;
}) {
  const t = useT(ecommerceDict);
  const p = PRODUCTS.find((x) => x.id === id);
  const [qty, setQty] = useState(1);

  if (!p)
    return (
      <div className="bg-background flex min-h-dvh flex-col">
        <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
          <EmptyState
            icon={<Package />}
            title={t('product.notFound.title')}
            description={t('product.notFound.body')}
            action={
              <Button variant="secondary" leadingIcon={<ArrowLeft />} onClick={onBack}>
                {t('shop.back')}
              </Button>
            }
            headingLevel={1}
            className="min-h-[320px]"
          />
        </main>
        <ShopFooter onHelp={onHelp} />
      </div>
    );

  const specs = [
    [t('product.spec.battery'), t('product.spec.batteryValue')],
    [t('product.spec.weight'), t('product.spec.weightValue')],
    [t('product.spec.warranty'), t('product.spec.warrantyValue')],
  ];

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> {t('shop.back')}
        </button>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Shot hue={p.hue} className="aspect-square w-full rounded-xl" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 30, 60, 90].map((d) => (
                <Shot key={d} hue={p.hue + d} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Badge tone="neutral" variant="outline">
              {catLabel(t, p.tag)}
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{itemName(t, p.id)}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars rating={p.rating} />
              <span className="text-foreground-subtle text-xs">
                {t('product.reviews', { n: 214 })}
              </span>
            </div>
            <div className="tabular text-foreground mt-4 text-2xl font-semibold">
              {money(p.price, t.locale)}
            </div>
            <p className="text-foreground-muted mt-4 text-sm leading-relaxed">
              {t('product.description')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <QtyStepper qty={qty} onChange={setQty} />
              <Button className="flex-1" onClick={() => addToCart(p.id, qty)}>
                <ShoppingCart className="mr-1 size-4" aria-hidden /> {t('product.addToCart')}
              </Button>
            </div>
            <Separator className="my-6" />
            <dl className="space-y-2 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-foreground-muted">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function CartScreen({
  brand,
  onShop,
  onHelp,
  cart,
  setQty,
  remove,
  onCategory,
}: {
  brand: React.ReactNode;
  onShop: () => void;
  onHelp: (topic: HelpTopic) => void;
  cart: Cart;
  setQty: (id: ProductId, qty: number) => void;
  remove: (id: ProductId) => void;
  onCategory: (c: Category) => void;
}) {
  const t = useT(ecommerceDict);
  const items = PRODUCTS.filter((p) => cart[p.id]);
  const cartCount = countItems(cart);
  const subtotal = items.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const shipping = items.length > 0 ? 9 : 0;

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={() => {}} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t('cart.title')}</h1>
        {items.length === 0 ? (
          <div className="border-border bg-card mt-6 rounded-lg border p-12 text-center">
            <ShoppingCart className="text-foreground-subtle mx-auto size-8" aria-hidden />
            <p className="mt-3 text-sm font-medium">{t('cart.empty.title')}</p>
            <p className="text-foreground-muted mt-1 text-sm">{t('cart.empty.body')}</p>
            <Button size="sm" className="mt-4" onClick={onShop}>
              {t('cart.continue')}
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <Card padding="none">
              <ul className="divide-border divide-y">
                {items.map((p) => {
                  const qty = cart[p.id] ?? 0;
                  const name = itemName(t, p.id);
                  return (
                    <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                      <Shot hue={p.hue} className="size-16 shrink-0 rounded-md" />
                      <div className="min-w-0 flex-1 basis-32">
                        <div className="text-foreground font-medium">{name}</div>
                        <div className="text-foreground-subtle text-sm">
                          {money(p.price, t.locale)}
                        </div>
                      </div>
                      {/* Controls drop to a second, full-width row below sm. */}
                      <div className="flex w-full items-center gap-3 sm:w-auto">
                        <QtyStepper qty={qty} onChange={(q) => setQty(p.id, q)} />
                        <div className="tabular text-foreground ml-auto min-w-16 text-right font-medium">
                          {money(p.price * qty, t.locale)}
                        </div>
                        <IconButton
                          aria-label={t('cart.remove', { name })}
                          icon={<Trash2 />}
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(p.id)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">{t('cart.subtotal')}</span>
                  <span className="tabular text-foreground">{money(subtotal, t.locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">{t('cart.shipping')}</span>
                  <span className="tabular text-foreground">{money(shipping, t.locale)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="tabular">{money(subtotal + shipping, t.locale)}</span>
                </div>
                <Button className="mt-2 w-full">{t('cart.checkout')}</Button>
                <Button variant="ghost" className="w-full" onClick={onShop}>
                  {t('cart.continue')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

export function EcommerceTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [cart, setCart] = useState<Cart>({ aura: 1, lumen: 2 });
  const [category, setCategory] = useState<Category>('all');
  // Product id lives in the hash tail (`…?id=drift`) so a product page can be
  // reloaded or shared; an unknown id renders the in-template not-found.
  // `writeHash` carries `?lang=` over, so the locale survives navigation.
  const [productId, setProductId] = useState(() => readHashParams().get('id') ?? PRODUCTS[0].id);
  const [helpTopic, setHelpTopic] = useState<HelpTopic>('shipping');
  const cartCount = countItems(cart);
  const openProduct = (id: ProductId) => {
    setProductId(id);
    writeHash({ id });
    setScreen('product');
  };
  const go = (next: string) => {
    writeHash({});
    setScreen(next);
  };
  const openHelp = (topic: HelpTopic) => {
    setHelpTopic(topic);
    go('help');
  };

  const addToCart = (id: ProductId, qty: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }));
    go('cart');
  };
  const setQty = (id: ProductId, qty: number) =>
    setCart((prev) => (qty <= 0 ? removeKey(prev, id) : { ...prev, [id]: qty }));
  const remove = (id: ProductId) => setCart((prev) => removeKey(prev, id));
  const goCategory = (c: Category) => {
    setCategory(c);
    go('shop');
  };

  if (screen === 'product')
    return (
      <ProductScreen
        brand={brand}
        id={productId}
        cartCount={cartCount}
        onBack={() => go('shop')}
        onCart={() => go('cart')}
        onHelp={openHelp}
        addToCart={addToCart}
        onCategory={goCategory}
      />
    );
  if (screen === 'cart')
    return (
      <CartScreen
        brand={brand}
        cart={cart}
        setQty={setQty}
        remove={remove}
        onShop={() => go('shop')}
        onHelp={openHelp}
        onCategory={goCategory}
      />
    );
  if (screen === 'help')
    return (
      <HelpScreen
        brand={brand}
        topic={helpTopic}
        cartCount={cartCount}
        onCart={() => go('cart')}
        onCategory={goCategory}
        onShop={() => go('shop')}
        onHelp={openHelp}
      />
    );
  return (
    <Shop
      brand={brand}
      cartCount={cartCount}
      onOpen={openProduct}
      onCart={() => go('cart')}
      onHelp={openHelp}
      category={category}
      setCategory={setCategory}
    />
  );
}

function countItems(cart: Cart): number {
  return Object.values(cart).reduce<number>((s, q) => s + (q ?? 0), 0);
}

function removeKey(cart: Cart, id: ProductId): Cart {
  const { [id]: _removed, ...rest } = cart;
  return rest;
}
