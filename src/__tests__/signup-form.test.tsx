import { fireEvent, render, screen } from "@testing-library/react";
import { SignupForm } from "@/features/auth/signup-form";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("signup form", () => {
  it("requires explicit terms acceptance and links the relevant policies", () => {
    render(<SignupForm />);

    const acceptance = screen.getByRole("checkbox", { name: /read and accept/i });
    expect(acceptance).not.toBeChecked();
    expect(acceptance).toBeRequired();
    expect(screen.getByRole("link", { name: /terms & conditions/i })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /subscription, refund and cancellation/i })).toHaveAttribute("href", "/subscriptions");

    fireEvent.click(acceptance);
    expect(acceptance).toBeChecked();
  });

  it("validates password confirmation and shows requirements", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/workshop \/ business name/i), {
      target: { value: "Prime Auto" },
    });
    fireEvent.change(screen.getByLabelText(/owner name/i), { target: { value: "Aman" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: "9999999999" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "abcd1234" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "abcd9999" },
    });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByText(/min\. 8 characters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/branch name/i)).toBeInTheDocument();
  });
});
