import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-16">
      <SignIn />
    </section>
  );
}
