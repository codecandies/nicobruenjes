const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = eleventyConfig => {
  function relativeToInputPath(inputPath, relativeFilePath) {
    let split = inputPath.split("/");
    split.pop();

    return path.resolve(split.join(path.sep), relativeFilePath);
  }

  // Eleventy Image shortcode
  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths=[600], sizes="(min-width: 40em) 600px, 100vw", lazy="lazy") {
    let formats = ["avif", "webp", "auto"];
    let file = relativeToInputPath(this.page.inputPath, src);
    let metadata = await eleventyImage(file, {
      widths: widths || ["auto"],
      formats,
      outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: lazy,
      decoding: "async",
    };
    return eleventyImage.generateHTML(metadata, imageAttributes, {whitespaceMode: "inline"});
  });
};
