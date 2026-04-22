import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-16">
      <SignUp />
    </section>
  );
}
