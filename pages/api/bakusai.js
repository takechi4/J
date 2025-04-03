export default async function handler(req, res) {
  const { tid, tp } = req.query;
  if (!tid || !tp) {
    return res.status(400).json({ title: "missing parameters", posts: [] });
  }

  try {
    const response = await fetch(`https://bakusai.com/thr_res/?tid=${tid}&tp=${tp}`);
    const html = await response.text();

    const posts = [];
    let title = "";

    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/) ||
                       html.match(/<div class="threadTitle">([^<]+)<\/div>/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    const resBlocks = [...html.matchAll(/<div class="resArea">([\s\S]*?)<\/div>\s*<\/div>/g)];
    for (const block of resBlocks) {
      const resHtml = block[1];

      const numMatch = resHtml.match(/<div class="resNo">([^<]*)<\/div>/);
      const dateMatch = resHtml.match(/<div class="resDate">([^<]*)<\/div>/);
      const msgMatch = resHtml.match(/<div class="resMsg">([\s\S]*?)<\/div>/);

      if (!numMatch || !dateMatch || !msgMatch) continue;

      posts.push({
        num: numMatch[1].trim(),
        date: dateMatch[1].trim(),
        msg: msgMatch[1].trim(),
      });
    }

    return res.status(200).json({ title, posts });
  } catch (err) {
    return res.status(500).json({ title: "fetch error", posts: [] });
  }
}
