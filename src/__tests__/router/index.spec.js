import { describe, it, expect } from "vitest";
//import routes from "@/router/index";
import router from "@/router/index";

describe("Router", () => {
  it("tiene la ruta de login", () => {
    const routes = router.options.routes;
    const loginRoute = routes.find((r) => r.path === "/login");
    expect(loginRoute).toBeDefined();
    if (loginRoute) {
      expect(loginRoute.name).toBe("login");
    }
  });

  it("tiene la ruta de dashboard", () => {
    const routes = router.options.routes;
    const dashboardRoute = routes.find((r) => r.path === "/dashboard");
    expect(dashboardRoute).toBeDefined();
    if (dashboardRoute) {
      expect(dashboardRoute.name).toBe("dashboard");
      expect(dashboardRoute.meta?.requiresAuth).toBe(true);
    }
  });

  it("tiene la ruta de estudiantes", () => {
    const routes = router.options.routes;
    const estudiantesRoute = routes.find((r) => r.path === "/estudiantes");
    expect(estudiantesRoute).toBeDefined();
    if (estudiantesRoute) {
      expect(estudiantesRoute.name).toBe("estudiantes");
    }
  });

  it("tiene la ruta de patrocinadores", () => {
    const routes = router.options.routes;
    const patrocinadoresRoute = routes.find(
      (r) => r.path === "/patrocinadores",
    );
    expect(patrocinadoresRoute).toBeDefined();
    if (patrocinadoresRoute) {
      expect(patrocinadoresRoute.name).toBe("patrocinadores");
    }
  });

  it("tiene la ruta de patrocinios", () => {
    const routes = router.options.routes;
    const patrociniosRoute = routes.find((r) => r.path === "/patrocinios");
    expect(patrociniosRoute).toBeDefined();
    if (patrociniosRoute) {
      expect(patrociniosRoute.name).toBe("patrocinios");
    }
  });

  it("tiene la ruta about", () => {
    const routes = router.options.routes;
    const aboutRoute = routes.find((r) => r.path === "/about");
    expect(aboutRoute).toBeDefined();
    if (aboutRoute) {
      expect(aboutRoute.name).toBe("about");
    }
  });
});
