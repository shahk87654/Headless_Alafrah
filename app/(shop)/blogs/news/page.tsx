import Link from "next/link";

const posts = [
  { h: "custom-marble-tables-uae-buying-guide", t: "Custom marble tables in the UAE: a buying guide", tag: "Buying guide" },
  { h: "marble-coffee-table-designs-uae", t: "Marble coffee table designs for UAE homes", tag: "Design" },
  { h: "the-countries-made-beige-travertine-marble", t: "Where beige travertine marble is quarried", tag: "Materials" },
];

export default function Magazine() {
  return (
    <section>
      <h1>Magazine</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.h}>
            <Link href={`/blogs/news/${post.h}`}>
              <p>{post.tag}</p>
              <h2>{post.t}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
