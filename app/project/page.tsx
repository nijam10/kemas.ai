export default function ProjectPage() {
  const projects = [
    {
      title: "Etnivis Cultural Box",
      type: "Stand-up Pouch",
      edited: "Edited 2 hours ago",
    },
    {
      title: "Batik Lapis Coffee",
      type: "Mailer Box",
      edited: "Edited 5 hours ago",
    },
    {
      title: "Makaroni Bantet Pack",
      type: "Pillow Bag",
      edited: "Edited 1 day ago",
    },
    {
      title: "Premium Almonds",
      type: "Stand-up Pouch",
      edited: "Edited 2 days ago",
    },
  ];

  return (
    <section className="w-full bg-[#F9F6F3] p-8 md:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search designs..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-black sm:w-64"
          />

          <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black">
            Filter
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {project.title}
                </h2>
                <p className="mb-2 text-sm font-medium text-blue-600">
                  {project.type}
                </p>
                <p className="text-xs italic text-gray-400">
                  {project.edited}
                </p>
              </div>

              <button className="text-gray-400 transition hover:text-black">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-10 flex justify-center">
        <button className="text-sm font-medium text-gray-400 transition hover:text-black">
          Load More
        </button>
      </div>
    </section>
  );
}