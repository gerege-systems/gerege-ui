import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

function Demo({
  onOpen = () => {},
  onDelete = () => {},
  open,
  onOpenChange,
}: {
  onOpen?: () => void;
  onDelete?: () => void;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent className="extra">
        <DropdownMenuLabel>File</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onOpen}>
          Open<DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('is closed by default; trigger has menu semantics', () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens on click, renders items / label / separator, merges className', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('extra', 'min-w-[12rem]');
    // the trigger sits outside the modal layer (aria-hidden while open)
    expect(screen.getByRole('button', { name: 'Actions', hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-danger-text');
    expect(screen.getByText('⌘O')).toHaveClass('ml-auto');
  });

  it('selecting an item fires onSelect, closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Demo onOpen={onOpen} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.click(await screen.findByRole('menuitem', { name: /Open/ }));
    expect(onOpen).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('keyboard: ArrowDown opens and focuses first item; arrows move; Enter selects; Escape closes', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Demo onDelete={onDelete} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Open/ })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    // disabled "Rename" is skipped
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: /Open/ })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('controlled open / onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Demo open onOpenChange={onOpenChange} />);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('checkbox items toggle and radio items select', async () => {
    const user = userEvent.setup();
    function Demo2() {
      const [show, setShow] = useState(false);
      const [size, setSize] = useState('md');
      return (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>View</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={show} onCheckedChange={setShow}>
              Show grid
            </DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
              <DropdownMenuRadioItem value="sm">Small</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="md">Medium</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    render(<Demo2 />);
    const check = await screen.findByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(check).toHaveAttribute('aria-checked', 'false');
    await user.click(check);
    // Radix closes the menu on select; reopen to inspect
    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(await screen.findByRole('menuitemcheckbox', { name: 'Show grid' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Medium' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('menuitemradio', { name: 'Small' }));
    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Small' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('submenu opens from its trigger with ArrowRight', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>More</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    screen.getByRole('button', { name: 'More' }).focus();
    await user.keyboard('{Enter}');
    const sub = await screen.findByRole('menuitem', { name: 'Share' });
    expect(sub).toHaveClass('pl-8');
    expect(sub).toHaveAttribute('aria-haspopup', 'menu');
    await user.keyboard('{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
  });

  it('forwards refs to content and item', async () => {
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>T</DropdownMenuTrigger>
        <DropdownMenuContent ref={contentRef}>
          <DropdownMenuItem ref={itemRef} inset>
            Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(contentRef.current).toBe(await screen.findByRole('menu'));
    expect(itemRef.current).toBe(screen.getByRole('menuitem'));
    expect(itemRef.current).toHaveClass('pl-8');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    expect(await axeBody()).toHaveNoViolations();
  });
});

describe('DropdownMenuItem icons', () => {
  it('sizes a bare svg child to 16px like the other menus and buttons', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <svg data-testid="icon" viewBox="0 0 24 24" />
            Open
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('Actions'));
    const item = await screen.findByRole('menuitem');
    expect(item.className).toContain('[&_svg]:size-4');
    expect(item).toContainElement(screen.getByTestId('icon'));
  });
});
