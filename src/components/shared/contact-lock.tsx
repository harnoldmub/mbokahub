import { LockKeyhole } from "lucide-react";

type ContactLockProps = {
  value: string;
};

export function ContactLock({ value }: ContactLockProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <LockKeyhole aria-hidden className="size-4 text-primary" />
      <span className="select-none blur-sm">{value}</span>
    </div>
  );
}
