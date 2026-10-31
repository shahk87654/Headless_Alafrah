export default async function Article({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const title = handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <article className="journal-article">
      <header className="journal-article-heading">
        <p className="eyebrow">Al Afrah journal</p>
        <h1>{title}</h1>
        <p className="journal-article-deck">Practical guidance from the Al Afrah workshop in Dubai.</p>
      </header>
      <div className="journal-article-image" aria-hidden="true"><span /><span /></div>
      <div className="journal-article-body">
      <p className="journal-lede">
        Start with how the table will be used, the light in the room, and whether you want a honed or polished finish.
        Stone choice is a practical decision: porosity, veining, thickness and how the slab is bookmatched.
      </p>
      <h2>Choosing the stone</h2>
      <p>
        Travertine has open pores and a warm body. Calacatta is a white ground with grey veins. Onyx is often
        translucent and can be backlit. Arabescato has moving grey veins on white. Black Marquina, Emperador Dark,
        Jungle Green and Red Travertine are kept for contrast and outdoor or wet-area work as specified.
      </p>
      <h2>Size</h2>
      <p>
        Measure doorways, lifts and the floor area before you lock length and width. The workshop can cut to your
        dimensions; send the room photos with the quote request.
      </p>
      </div>
    </article>
  );
}
