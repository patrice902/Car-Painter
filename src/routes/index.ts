import { async } from "src/components/common";

export type RouteItem = {
  id?: string;
  path: string;
  name?: string;
  component: React.ComponentType | null;
  guarded?: boolean;
  redirectToSignIn?: boolean;
  adminOnly?: boolean;
  children?: RouteItem[];
};

// Auth components
const SignIn = async(() => import("src/pages/auth/SignIn"));
const Page404 = async(() => import("src/pages/auth/Page404"));
const Page500 = async(() => import("src/pages/auth/Page500"));

// Main components
const Scheme = async(() => import("src/pages/scheme"));
const Projects = async(() => import("src/pages/projects"));
const Admin = async(() => import("src/pages/admin"));

const authRoutes: RouteItem = {
  id: "Auth",
  path: "/auth",
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

const projectsRoute: RouteItem = {
  id: "Projects",
  path: "/",
  name: "Projects",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const myProjectRoute: RouteItem = {
  id: "My Project",
  path: "/mine",
  name: "My Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const sharedProjectRoute: RouteItem = {
  id: "Shared Project",
  path: "/shared",
  name: "Shared Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const favoriteProjectRoute: RouteItem = {
  id: "Favorite Project",
  path: "/favorite",
  name: "Favorite Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const projectRoute: RouteItem = {
  id: "Project",
  path: "/project/:id",
  name: "project",
  component: Scheme,
  guarded: true,
  redirectToSignIn: true,
};

const adminRoute: RouteItem = {
  id: "admin",
  path: "/admin",
  name: "Admin Panel",
  component: Admin,
  guarded: true,
  redirectToSignIn: true,
  adminOnly: true,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes: RouteItem[] = [
  projectsRoute,
  myProjectRoute,
  sharedProjectRoute,
  favoriteProjectRoute,
  projectRoute,
  adminRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes: RouteItem[] = [authRoutes];
