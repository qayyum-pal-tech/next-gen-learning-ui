import ResultsPage from "@/app/components/ResultsPage";

export default async function Page({ params }: { params: Promise<{ quizId: string }> }) {
    return (
        <ResultsPage params={params} />
    );
}