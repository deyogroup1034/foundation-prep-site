import { useEffect, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

interface Props {
  nav: NavItem[];
  currentStudents: NavItem[];
  phone: string;
  donate: string;
}

const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

/** One nav level. Items with children render as a disclosure. */
function Level({ items, depth }: { items: NavItem[]; depth: number }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul className={depth === 0 ? '' : 'border-l border-white/15 pl-3'}>
      {items.map((item) => {
        const hasKids = !!item.children?.length;
        const isOpen = open === item.label;
        return (
          <li key={item.label} className="border-b border-white/10 last:border-0">
            <div className="flex items-center">
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="flex-1 py-3 font-[family-name:var(--font-head)] text-[15px] font-medium uppercase text-white"
              >
                {item.label}
              </a>
              {hasKids && (
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                  className="px-3 py-3 text-white"
                >
                  <span
                    className={`inline-block transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  >
                    &rsaquo;
                  </span>
                </button>
              )}
            </div>
            {hasKids && isOpen && <Level items={item.children!} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
}

export default function MobileNav({ nav, currentStudents, phone, donate }: Props) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] xl:hidden"
      >
        <span className="block h-[2px] w-6 bg-white" />
        <span className="block h-[2px] w-6 bg-white" />
        <span className="block h-[2px] w-6 bg-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-[380px] flex-col overflow-y-auto bg-[color:var(--color-brand)] px-5 pb-8 shadow-xl">
            <div className="flex justify-end py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-3xl leading-none text-white"
              >
                &times;
              </button>
            </div>

            <Level items={nav} depth={0} />

            <div className="mt-6 border-t border-white/20 pt-5">
              <p className="mb-2 font-[family-name:var(--font-head)] text-[13px] font-medium uppercase tracking-wide text-white/70">
                Current Students
              </p>
              <ul>
                {currentStudents.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="block py-2 font-[family-name:var(--font-head)] text-[15px] font-medium uppercase text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={donate}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-white/40 px-4 py-3 text-center font-[family-name:var(--font-head)] text-[13px] font-medium uppercase text-white"
              >
                Donate Now
              </a>
              <a
                href={telHref(phone)}
                className="text-center font-[family-name:var(--font-head)] text-[15px] font-medium text-white"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
