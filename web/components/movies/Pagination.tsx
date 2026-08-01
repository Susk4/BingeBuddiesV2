import Button from "../ui/Button";

const Pagination = ({
  setPage,
  page,
  pages,
}: {
  setPage: (p: number) => void;
  page: number;
  pages: number;
}) => {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-4"
      aria-label="Pagination"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      <span className="min-w-[5rem] text-center text-sm text-ink-muted">
        Page <span className="font-medium text-ink">{page}</span> of {pages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
