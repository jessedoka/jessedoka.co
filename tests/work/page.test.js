import { render, screen } from "@testing-library/react";
import WorkPage from "@/app/work/page";

describe("WorkPage", () => {
    it("renders the work page title", () => {
        render(<WorkPage />);
        const titleElement = screen.getByText(/my work/i);
        expect(titleElement).toBeInTheDocument();
    });

    it("renders work experiences", () => {
        render(<WorkPage />);
        const workExperienceTitles = screen.getAllByRole("heading", { level: 2 });
        expect(workExperienceTitles.length).toBeGreaterThan(0);
    });

    it("renders achievements for each work experience", () => {
        render(<WorkPage />);
        const achievementLists = screen.getAllByRole("list");
        expect(achievementLists.length).toBeGreaterThan(0);
    });
});