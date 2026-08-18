import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Navbar", () => {
  it("renders all nav links", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Home")).toHaveLength(3); // mobile + desktop + tooltip
    expect(screen.getAllByText("Schedule")).toHaveLength(3);
    expect(screen.getAllByText("Exercises")).toHaveLength(3);
    expect(screen.getAllByText("Progress")).toHaveLength(3);
    expect(screen.getAllByText("Diet")).toHaveLength(3);
    expect(screen.getAllByText("Profile")).toHaveLength(3);
  });

  it("renders mobile navigation", () => {
    render(<Navbar />);
    const mobileNav = document.getElementById("mobile-nav");
    expect(mobileNav).toBeInTheDocument();
  });

  it("renders desktop navigation", () => {
    render(<Navbar />);
    const desktopNav = document.getElementById("desktop-nav");
    expect(desktopNav).toBeInTheDocument();
  });

  it("has unique IDs for mobile nav items", () => {
    render(<Navbar />);
    expect(document.getElementById("nav-mobile-home")).toBeInTheDocument();
    expect(document.getElementById("nav-mobile-schedule")).toBeInTheDocument();
    expect(document.getElementById("nav-mobile-exercises")).toBeInTheDocument();
    expect(document.getElementById("nav-mobile-progress")).toBeInTheDocument();
    expect(document.getElementById("nav-mobile-diet")).toBeInTheDocument();
    expect(document.getElementById("nav-mobile-profile")).toBeInTheDocument();
  });

  it("has unique IDs for desktop nav items", () => {
    render(<Navbar />);
    expect(document.getElementById("nav-desktop-home")).toBeInTheDocument();
    expect(document.getElementById("nav-desktop-schedule")).toBeInTheDocument();
    expect(document.getElementById("nav-desktop-exercises")).toBeInTheDocument();
  });

  it("home link points to /dashboard", () => {
    render(<Navbar />);
    const homeLinks = screen.getAllByText("Home");
    homeLinks.forEach((link) => {
      expect(link.closest("a")).toHaveAttribute("href", "/dashboard");
    });
  });

  it("schedule link points to /schedule", () => {
    render(<Navbar />);
    const links = screen.getAllByText("Schedule");
    links.forEach((link) => {
      expect(link.closest("a")).toHaveAttribute("href", "/schedule");
    });
  });
});
