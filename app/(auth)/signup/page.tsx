import Image from 'next/image';
import SignupForm from '@/src/features/auth/components/SignupForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left panel — illustration (desktop only) */}
      <div className="hidden lg:flex w-1/2 max-w-[600px] p-5 shrink-0">
        <div className="relative flex flex-col justify-between w-full h-full bg-grey-900 rounded-xl p-10 overflow-hidden">
          <Image
            src="/illustration-authentication.svg"
            alt=""
            fill
            className="object-cover rounded-xl"
            priority
          />

          {/* Logo */}
          <span className="relative z-10 text-white font-bold text-xl tracking-tight">
            finance
          </span>

          {/* Tagline */}
          <div className="relative z-10 flex flex-col gap-6 text-white">
            <h2 className="text-[2rem] font-bold leading-[1.2]">
              Keep track of your money
              <br />
              and save for your future
            </h2>
            <p className="text-sm leading-relaxed">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 lg:px-10">
        <SignupForm />
      </div>
    </main>
  );
}
