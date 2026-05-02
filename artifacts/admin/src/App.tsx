import { useEffect, useRef } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useClerk,
} from "@clerk/clerk-react";
import { shadcn } from "@clerk/themes";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from "wouter";
import {
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import ProjectsListPage from "@/pages/projects-list";
import ProjectEditPage from "@/pages/project-edit";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Falta VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#0a0a0a",
    colorForeground: "#0a0a0a",
    colorMutedForeground: "#5b5b5b",
    colorDanger: "#a8201a",
    colorBackground: "#ffffff",
    colorInput: "#ffffff",
    colorInputForeground: "#0a0a0a",
    colorNeutral: "#0a0a0a",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "2px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-white border border-neutral-200 rounded-none w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-neutral-900 font-medium tracking-tight",
    headerSubtitle: "text-neutral-500",
    socialButtonsBlockButtonText: "text-neutral-800",
    formFieldLabel:
      "text-neutral-600 text-xs uppercase tracking-[0.18em] font-medium",
    footerActionLink: "text-neutral-900 underline underline-offset-4",
    footerActionText: "text-neutral-500",
    dividerText:
      "text-neutral-400 text-xs uppercase tracking-[0.18em]",
    identityPreviewEditButton: "text-neutral-700",
    formFieldSuccessText: "text-neutral-700",
    alertText: "text-neutral-700",
    logoBox: "mb-2",
    logoImage: "h-8",
    socialButtonsBlockButton:
      "border border-neutral-300 hover:bg-neutral-50 rounded-none",
    formButtonPrimary:
      "bg-neutral-900 hover:bg-neutral-800 text-white rounded-none",
    formFieldInput:
      "border border-neutral-300 focus:border-neutral-900 rounded-none",
    footerAction: "text-neutral-500",
    dividerLine: "bg-neutral-200",
    alert: "border border-neutral-300 rounded-none",
    otpCodeFieldInput:
      "border border-neutral-300 focus:border-neutral-900 rounded-none",
    formFieldRow: "",
    main: "",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <SignedIn>
        <Redirect to="/projects" />
      </SignedIn>
      <SignedOut>
        <Redirect to="/sign-in" />
      </SignedOut>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Redirect to="/sign-in" />
      </SignedOut>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Acceso al panel",
            subtitle: "Ingresa con tu cuenta del estudio",
          },
        },
        signUp: {
          start: {
            title: "Crear cuenta",
            subtitle: "Registra una cuenta del estudio",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/projects">
              <ProtectedRoute>
                <ProjectsListPage />
              </ProtectedRoute>
            </Route>
            <Route path="/projects/new">
              <ProtectedRoute>
                <ProjectEditPage mode="create" />
              </ProtectedRoute>
            </Route>
            <Route path="/projects/:id">
              {(params) => (
                <ProtectedRoute>
                  <ProjectEditPage mode="edit" projectId={params.id} />
                </ProtectedRoute>
              )}
            </Route>
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

export function getSignInPageRoute(): string {
  return `${basePath}/sign-in`;
}

export function getSignUpPageRoute(): string {
  return `${basePath}/sign-up`;
}

export const ADMIN_BASE_PATH = basePath;

export { SignIn, SignUp };
