export default function Report() {
  return (
    <div>
      <h1>Report</h1>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
          console.log(window.location.pathname);
        }}
      >
        test
      </button>
    </div>
  );
}
