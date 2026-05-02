import { SignIn } from "@clerk/clerk-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <h2 className="mt-6 text-3xl font-display tracking-tight text-foreground">
              2M Arquitectos <span className="text-muted-foreground font-light">&middot; Panel</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa con tu cuenta del estudio para continuar.
            </p>
          </div>
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
          />
        </div>
      </div>
      <div className="hidden lg:block lg:flex-1 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Subtle architectural graphic or logo placeholder */}
          <div className="w-64 h-64 border border-border opacity-20" />
        </div>
      </div>
    </div>
  );
}
