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

    // スレタイ取得
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/) ||
                       html.match(/<div class="threadTitle">([^<]+)<\/div>/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // 各レス抽出（爆サイ最新仕様対応）
    const resBlocks = [...html.matchAll(/<div class="resNo">(#?\d+)<\/div>\\s*<div class="resDate">([^<]+)<\/div>\\s*<div class="resMsg">([\s\S]*?)<\/div>/g)];

    for (const match of resBlocks) {
      posts.push({
        num: match[1].trim(),
        date: match[2].trim(),
        msg: match[3].trim(),
      });
    }

    if (posts.length === 0) {
      return res.status(200).json({ title: "ika error!", posts: [] });
    }

    return res.status(200).json({ title, posts });
  } catch (err) {
    return res.status(500).json({ title: "fetch error", posts: [] });
  }
}
